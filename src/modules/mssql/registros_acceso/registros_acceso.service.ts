import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistroAcceso } from './entities/registros_acceso.entity';
import { Repository } from 'typeorm';
import { AccesosByFechaResponseDto, GetAccesosByFechaDto } from './dto/get-accesos-fecha.dto';
import { AccesosByFechaAndProyectoResponseDto, GetAccesosByFechaAndProyectoDto } from './dto/get-accesos-fecha-proyecto.dto';
import { AccesosReturn } from './dto/get-accesos.dto';

@Injectable()
export class RegistrosAccesoService {
    constructor(
        @InjectRepository(RegistroAcceso, 'mssql')
        private readonly registrosAccesoRepository: Repository<RegistroAcceso>
    ) { }

    //Get accesos by fecha (distinct id_empleado)
    async getAccesosByFecha(params: GetAccesosByFechaDto): Promise<AccesosByFechaResponseDto[]> {
        const accesos = await this.registrosAccesoRepository
            .createQueryBuilder('registros_acceso')
            .select('CAST(registros_acceso.id_empleado AS BIGINT)', 'dni')
            .distinct(true)
            .where('registros_acceso.fecha_acceso = :fecha', { fecha: params.fecha })
            .getRawMany();

        return accesos;
    };

    //Get accesos by fecha and proyecto (distinct id_empleado)
    async getAccesosByFechaAndProyecto(params: GetAccesosByFechaAndProyectoDto): Promise<AccesosByFechaAndProyectoResponseDto[]> {
        const accesos = await this.registrosAccesoRepository
            .createQueryBuilder('registros_acceso')
            .select('CAST(registros_acceso.id_empleado AS BIGINT)', 'dni')
            .distinct(true)
            .where('registros_acceso.fecha_acceso = :fecha', { fecha: params.fecha })
            .andWhere('registros_acceso.numero_serie_dispositivo IN (:...dispositivos)', { dispositivos: params.dispositivos })
            .getRawMany();

        return accesos;
    };

    //Get accesos by fecha and proyecto
    async getAccesos(params: GetAccesosByFechaAndProyectoDto): Promise<AccesosReturn[]> {
        const accesos = await this.registrosAccesoRepository
            .createQueryBuilder('registros_acceso')
            .select([
                'registros_acceso.fecha_acceso AS fecha_acceso',
                'registros_acceso.hora_acceso AS hora_acceso',
                'registros_acceso.nombre AS nombre',
                'registros_acceso.fecha_hora_acceso AS fecha_hora_acceso',
                'CAST(registros_acceso.id_empleado AS BIGINT) AS dni'
            ])
            .where('registros_acceso.fecha_acceso = :fecha', { fecha: params.fecha })
            .andWhere('registros_acceso.numero_serie_dispositivo IN (:...dispositivos)', { dispositivos: params.dispositivos })
            .getRawMany();

        return accesos;
    };
};
