import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoParametro } from './entities/estadoparametro.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoParametroService {
    private idCache: Map<string, number> = new Map();

    constructor(
        @InjectRepository(EstadoParametro)
        private estadoParametroRepository: Repository<EstadoParametro>
    ) { }

    //helper
    async getOrCreateEstadoParametro(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached) return cached;

        let estadoParametro = await this.estadoParametroRepository.findOne({
            where: { nombre: nombre }
        });

        if (!estadoParametro) {
            estadoParametro = this.estadoParametroRepository.create({ nombre: nombre });
            estadoParametro = await this.estadoParametroRepository.save(estadoParametro);
        };

        this.idCache.set(nombre, estadoParametro.id)

        return estadoParametro.id;
    };

    //Get estado parametro activo
    async getEstadoParametroActivo(): Promise<number> {
        return this.getOrCreateEstadoParametro('Activo');
    };

    //Get estado parametro baja
    async getEstadoParametroBaja(): Promise<number> {
        return this.getOrCreateEstadoParametro('Baja');
    };
};
