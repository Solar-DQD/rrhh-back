import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observacion } from './entities/observacion.entity';
import { Repository } from 'typeorm';
import { CreateObservacionDto } from './dto/create-observacion.dto';
import { GetObservacionesByEmpleadoDto, ObservacionesByEmpleadoResponseDto } from './dto/get-observacion-empleado.dto';

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
        
        if (params.mes !== 0) {
            query.andWhere('j.id_mes = :mes', { mes: params.mes });
        };

        if (params.quincena !== 0) {
            query.innerJoin('j.quincena', 'q')
                .andWhere('q.quincena = :quincena', { quincena: params.quincena });
        };

        const [observaciones, totalObservaciones] = await query.getManyAndCount();

        return {
            observaciones: observaciones.map(observacion => ({
                id: observacion.id,
                texto: observacion.texto,
                fecha: observacion.jornada?.fecha
            })),
            totalObservaciones
        };
    };
};
