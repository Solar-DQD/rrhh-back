import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observacion } from './entities/observacion.entity';
import { Repository } from 'typeorm';
import { CreateObservacionDto } from './dto/create-observacion.dto';
import { GetObservacionesByEmpleadoDto, ObservacionesByEmpleadoResponseDto } from './dto/get-observacion-empleado.dto';
import { DeleteObservacionDto } from './dto/delete-observacion.dto';

@Injectable()
export class ObservacionService {
    constructor(
        @InjectRepository(Observacion)
        private observacionRepository: Repository<Observacion>
    ) { }

    //Create observacion
    async createObservacion(params: CreateObservacionDto): Promise<void> {
        const observacion = this.observacionRepository.create({ texto: params.texto, id_jornada: params.id_jornada });
        await this.observacionRepository.save(observacion);
    };

    //Get observacion by empleado
    async getObservacionesByEmpleado(params: GetObservacionesByEmpleadoDto): Promise<ObservacionesByEmpleadoResponseDto> {
        const query = this.observacionRepository
            .createQueryBuilder('o')
            .select(['o.id', 'o.texto', 'j.fecha'])
            .innerJoin('o.jornada', 'j')
            .where('j.id_empleado = :id_empleado', { id_empleado: params.id_empleado })
            .take(params.limit)
            .skip(params.page * params.limit);

        if (params.id_mes !== undefined) {
            query.andWhere('j.id_mes = :mes', { mes: params.id_mes });
        } else {
            query.andWhere('j.id_mes = :no_mes', { no_mes: 0 });
        };

        if (params.quincena !== undefined) {
            query.innerJoin('j.quincena', 'q')
                .andWhere('q.quincena = :quincena', { quincena: params.quincena });
        };

        const [observaciones, totalObservaciones] = await query.getManyAndCount();

        return {
            observaciones: observaciones.map(observacion => ({
                id: observacion.id,
                texto: observacion.texto,
                fecha: observacion.jornada?.fecha.toString()
            })),
            totalObservaciones
        };
    };

    //Delete observacion
    async deleteObservacion(params: DeleteObservacionDto): Promise<void> {
        const result = await this.observacionRepository.delete({ id: params.id });

        if (result.affected === 0) {
            throw new NotFoundException(`Observacion with id ${params.id} not found`)
        };
    };
};
