import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nomina } from './entities/nomina.entity';
import { Brackets, Repository } from 'typeorm';
import { NominaActivaResponseDto } from './dto/get-nomina-activa.dto';
import { GetNominaActivaByProyectoDto, NominaActivaByProyectoResponseDto } from './dto/get-nomina-activa-proyecto.dto';

@Injectable()
export class NominaService {
    constructor(
        @InjectRepository(Nomina, 'mssql')
        private readonly nominaRepository: Repository<Nomina>
    ) { }

    //Get nomina activa
    async getNominaActiva(): Promise<NominaActivaResponseDto[]> {
        const nomina = await this.nominaRepository
            .createQueryBuilder('nomina')
            .select('CAST(nomina.dni AS BIGINT)', 'dni')
            .addSelect('nomina.legajo', 'legajo')
            .addSelect('nomina.apellido', 'apellido')
            .addSelect('nomina.nombre', 'nombre')
            .addSelect('nomina.proyecto', 'proyecto')
            .addSelect('nomina.convenio', 'convenio')
            .distinct(true)
            .where(
                new Brackets(qb => {
                    qb.where('nomina.ingreso IS NULL')
                        .orWhere('GETDATE() >= nomina.ingreso');
                })
            )
            .andWhere(
                new Brackets(qb => {
                    qb.where('nomina.egreso IS NULL')
                        .orWhere('GETDATE() <= nomina.egreso');
                })
            )
            .andWhere('nomina.apellido NOT LIKE :apellido', { apellido: '%GARIN ODRIOZOLA%' })
            .getRawMany();

        return nomina;
    };

    //Get nomina activa by proyecto
    async getNominaActivaByProyecto(params: GetNominaActivaByProyectoDto): Promise<NominaActivaByProyectoResponseDto[]> {
        const nomina = await this.nominaRepository
            .createQueryBuilder('nomina')
            .select('CAST(nomina.dni AS BIGINT)', 'dni')
            .distinct(true)
            .where(
                new Brackets(qb => {
                    qb.where('nomina.ingreso IS NULL')
                        .orWhere('GETDATE() >= nomina.ingreso');
                })
            )
            .andWhere(
                new Brackets(qb => {
                    qb.where('nomina.egreso IS NULL')
                        .orWhere('GETDATE() <= nomina.egreso');
                })
            )
            .andWhere('nomina.proyecto = :proyecto', { proyecto: params.proyecto })
            .andWhere('nomina.apellido NOT LIKE :apellido', { apellido: '%GARIN ODRIOZOLA%' })
            .getRawMany();

        return nomina;
    };
};
