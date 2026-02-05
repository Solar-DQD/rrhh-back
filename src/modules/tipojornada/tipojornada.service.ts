import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoJornada } from './entities/tipojornada.entitie';
import { Repository } from 'typeorm';

@Injectable()
export class TipoJornadaService {
    constructor(
        @InjectRepository(TipoJornada)
        private tipoJornadaRepository: Repository<TipoJornada>
    ) { }

    //Get all
    async getTiposJornada(): Promise<TipoJornada[]> {
        return await this.tipoJornadaRepository.find();
    };

    //Get tipo jornada Ausencia
    async getTipoJornadaAusencia(): Promise<number> {
        let tipoJornada = await this.tipoJornadaRepository.findOne({
            where: { nombre: 'Ausencia' }
        });

        if (!tipoJornada) {
            tipoJornada = this.tipoJornadaRepository.create({ nombre: 'Ausencia' });
            tipoJornada = await this.tipoJornadaRepository.save(tipoJornada);
        };

        return tipoJornada.id;
    };
};
