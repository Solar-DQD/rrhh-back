import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Importacion } from './entities/importacion.entity';
import { Repository } from 'typeorm';
import { EstadoImportacionService } from '../estadoimportacion/estadoimportacion.service';
import { GetImportacionesDto, ImportacionesResponseDto } from './dto/get-importacion.dto';
import { SetEstadoImportacionCompletaDto } from './dto/set-importacion-completa.dto';
import { DeleteImportacionDto } from './dto/delete-importacion.dto';
import { CreateImportacionDto } from './dto/create-importacion.dto';

@Injectable()
export class ImportacionService {
    constructor(
        @InjectRepository(Importacion)
        private importacionRepository: Repository<Importacion>,
        private estadoImportacionService: EstadoImportacionService
    ) { }

    //Get importaciones
    async getImportaciones(params: GetImportacionesDto): Promise<ImportacionesResponseDto> {
        const id_estadoimportacion = await this.estadoImportacionService.getEstadoImportacionCompleta();

        const query = this.importacionRepository
            .createQueryBuilder('i')
            .select(['i.id', 'i.fecha', 'i.nombrearchivo', 'e.nombre', 'u.nombre', 'p.nombre'])
            .innerJoin('i.estadoimportacion', 'e')
            .innerJoin('i.usuario', 'u')
            .innerJoin('i.proyecto', 'p')
            .take(params.limit)
            .skip(params.page * params.limit)
            .orderBy('i.fecha', 'DESC');

        if (params.incompletas) {
            query.andWhere('i.id_estadoimportacion != :id_estadoimportacion', { id_estadoimportacion: id_estadoimportacion });
        };

        if (params.id_proyecto !== undefined) {
            query.andWhere('i.id_proyecto = :id_proyecto', { id_proyecto: params.id_proyecto })
        };

        const [importaciones, totalImportaciones] = await query.getManyAndCount();

        return {
            importaciones: importaciones.map(importacion => ({
                id: importacion.id,
                fecha: importacion.fecha,
                nombre: importacion.nombrearchivo,
                nombreestado: importacion.estadoimportacion?.nombre,
                nombreusuario: importacion.usuario?.nombre,
                nombreproyecto: importacion.proyecto?.nombre
            })),
            totalImportaciones
        };
    };

    //Set importacion state 'Completa'
    async setEstadoImportacionCompleta(params: SetEstadoImportacionCompletaDto): Promise<void> {
        const id_estadoimportacion = await this.estadoImportacionService.getEstadoImportacionCompleta();

        const result = await this.importacionRepository.update(
            {
                id: params.id
            },
            {
                id_estadoimportacion: id_estadoimportacion
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Importacion with id ${params.id} not found`)
        };
    };

    //Delete importacion
    async deleteImportacion(params: DeleteImportacionDto): Promise<void> {
        const result = await this.importacionRepository.delete({ id: params.id });

        if (result.affected === 0) {
            throw new NotFoundException(`Importacion with id ${params.id} not found`)
        };
    };

    //Create importacion
    async createImportacion(params: CreateImportacionDto): Promise<number> {
        let importacion = this.importacionRepository.create({
            nombrearchivo: params.filename,
            id_proyecto: params.id_proyecto,
            id_estadoimportacion: params.id_estadoimportacion,
            id_tipoimportacion: params.id_tipoimportacion,
            id_usuariocreacion: params.id_usuariocreacion
        });
        importacion = await this.importacionRepository.save(importacion);

        return importacion.id;
    };
};
