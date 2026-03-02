import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoJornada } from './entities/tipojornada.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoJornadaService {
    private idCache: Map<string, number> = new Map();
    private cache: TipoJornada[] | null = null;

    constructor(
        @InjectRepository(TipoJornada)
        private tipoJornadaRepository: Repository<TipoJornada>
    ) { }

    //Get all
    async getTiposJornada(): Promise<TipoJornada[]> {
        if (this.cache) return this.cache

        this.cache = await this.tipoJornadaRepository.find();

        this.cache.forEach(tipo => {
            this.idCache.set(tipo.nombre, tipo.id);
        });

        return this.cache;
    };

    //helper
    private async getOrCreateTipoJornada(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached !== undefined) return cached;

        let tipoJornada = await this.tipoJornadaRepository.findOne({
            where: { nombre: nombre }
        });

        if (!tipoJornada) {
            tipoJornada = this.tipoJornadaRepository.create({ nombre: nombre });
            tipoJornada = await this.tipoJornadaRepository.save(tipoJornada);

            this.cache = null;
        };

        this.idCache.set(nombre, tipoJornada.id);

        return tipoJornada.id;
    };

    //Get tipo jornada Ausencia
    async getTipoJornadaAusencia(): Promise<number> {
        return this.getOrCreateTipoJornada('Ausencia');
    };
};
