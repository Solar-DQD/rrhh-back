import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Proyecto } from './entities/proyecto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { EstadoParametroService } from '../estadoparametro/estadoparametro.service';
import { GetProyectosPaginatedDto, ProyectosPaginatedResponseDto } from './dto/get-proyecto-paginated.dto';
import { EditProyectoDto } from './dto/edit-proyecto.dto';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { GetProyectoByIdDto } from './dto/get-proyecto-id.dto';
import { GetProyectoByNominaDto } from './dto/get-proyecto-nomina.dto';
import { DeactivateProyectoDto } from './dto/deactivate-proyecto.dto';

@Injectable()
export class ProyectoService {
    private cache: Proyecto[] | null = null;

    constructor(
        @InjectRepository(Proyecto)
        private proyectoRepository: Repository<Proyecto>,
        private estadoParametroService: EstadoParametroService
    ) { }

    //Get all
    async getProyectos(): Promise<Proyecto[]> {
        if (this.cache) return this.cache;

        const id_estadoparametro = await this.estadoParametroService.getEstadoParametroBaja();

        this.cache = await this.proyectoRepository.find({
            where: { id_estadoparametro: Not(id_estadoparametro) }
        });

        return this.cache;
    };

    //Get proyecto Paginated
    async getProyectosPaginated(params: GetProyectosPaginatedDto): Promise<ProyectosPaginatedResponseDto> {
        const [proyectos, totalProyectos] = await this.proyectoRepository.findAndCount({
            relations: {
                estadoparametro: true,
                modalidadtrabajo: true
            },
            select: {
                id: true,
                nombre: true,
                nomina: true,
                id_modalidadtrabajo: true,
                estadoparametro: { nombre: true },
                modalidadtrabajo: { nombre: true }
            },
            skip: params.page * params.limit,
            take: params.limit,
            order: { id: 'ASC' }
        });

        return {
            proyectos: proyectos.map(proyecto => ({
                id: proyecto.id,
                nombre: proyecto.nombre,
                nomina: proyecto.nomina,
                id_modalidadtrabajo: proyecto.id_modalidadtrabajo,
                estadoparametro: proyecto.estadoparametro?.nombre,
                modalidadtrabajo: proyecto.modalidadtrabajo?.nombre
            })),
            totalProyectos: totalProyectos
        };
    };

    //Get proyecto modalidadTrabajao
    async getProyectoModalidadTrabajo(params: GetProyectoByIdDto): Promise<number> {
        const proyecto = await this.proyectoRepository.findOne({
            select: { id_modalidadtrabajo: true },
            where: { id: params.id }
        });

        if (!proyecto) {
            throw new NotFoundException(`Proyecto with id ${params.id} not found`);
        };

        return proyecto.id_modalidadtrabajo;
    };

    //Get proyecto nomina
    async getProyectoNomina(params: GetProyectoByIdDto): Promise<string> {
        const proyecto = await this.proyectoRepository.findOne({
            select: { nomina: true },
            where: { id: params.id }
        });

        if (!proyecto) {
            throw new NotFoundException(`Proyecto with id ${params.id} not found`);
        };

        return proyecto.nomina;
    };

    //Get proyecto by nomina
    async getProyectoByNomina(params: GetProyectoByNominaDto): Promise<number | null> {
        const proyecto = await this.proyectoRepository.findOne({
            select: { id: true },
            where: { nomina: params.nomina }
        });

        if (!proyecto) {
            return null;
        };

        return proyecto.id;
    };

    //Deactivate proyecto
    async deactivateProyecto(params: DeactivateProyectoDto): Promise<void> {
        const id_estadoparametro = await this.estadoParametroService.getEstadoParametroBaja();

        const result = await this.proyectoRepository.update(
            {
                id: params.id,
                id_estadoparametro: Not(id_estadoparametro)
            },
            {
                id_estadoparametro: id_estadoparametro
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`TipoAusencia with id ${params.id} not found or cannot be deactivated`);
        };

        this.cache = null;
    };

    //Edit proyecto
    async editProyecto(params: EditProyectoDto): Promise<void> {
        const id_estadoparametro = await this.estadoParametroService.getEstadoParametroBaja();

        const existing = await this.proyectoRepository.findOne({
            where: {
                id: Not(params.id),
                nombre: params.nombre,
                id_estadoparametro: Not(id_estadoparametro)
            }
        });

        if (existing) {
            throw new ConflictException(`Proyecto "${params.nombre}" already exists`);
        };

        const result = await this.proyectoRepository.update(
            {
                id: params.id,
                id_estadoparametro: Not(id_estadoparametro)
            },
            {
                nombre: params.nombre,
                nomina: params.nomina,
                id_modalidadtrabajo: params.id_modalidadtrabajo
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Proyecto with id ${params.id} not found or cannot be edited`);
        };

        this.cache = null;
    };

    //Create proyecto
    async createProyecto(params: CreateProyectoDto): Promise<void> {
        let id_estadoparametro = await this.estadoParametroService.getEstadoParametroBaja();

        const existing = await this.proyectoRepository.findOne({
            where : {
                nombre: params.nombre,
                id_estadoparametro: Not(id_estadoparametro)
            }
        });

        if (existing) {
            throw new ConflictException(`Proyecto "${params.nombre}" already exists`);
        };

        id_estadoparametro = await this.estadoParametroService.getEstadoParametroActivo();

        const proyecto = this.proyectoRepository.create({ nombre: params.nombre, nomina: params.nomina, id_modalidadtrabajo: params.id_modalidadtrabajo, id_estadoparametro: id_estadoparametro });
        await this.proyectoRepository.save(proyecto);

        this.cache = null;
    };
};
