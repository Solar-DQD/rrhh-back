import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoJornada } from './entities/estadojornada.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoJornadaService {
    private idCache: Map<string, number> = new Map();

    constructor(
        @InjectRepository(EstadoJornada)
        private estadoJornadaRepository: Repository<EstadoJornada>
    ) { }

    //helper
    async getOrCreateEstadoJornada(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached !== undefined) return cached;

        let estadoJornada = await this.estadoJornadaRepository.findOne({
            where: { nombre: nombre }
        });

        if (!estadoJornada) {
            estadoJornada = this.estadoJornadaRepository.create({ nombre: nombre });
            estadoJornada = await this.estadoJornadaRepository.save(estadoJornada);
        };

        this.idCache.set(nombre, estadoJornada.id);

        return estadoJornada.id;
    };

    //Get estadoJornada valida
    async getEstadoJornadaValida(): Promise<number> {
        return this.getOrCreateEstadoJornada('Validada');
    };

    //Get estadoJornada revision
    async getEstadoJornadaRevision(): Promise<number> {
        return this.getOrCreateEstadoJornada('Requiere Revision');
    };

    //Get estadoJornada sin validar
    async getEstadoJornadaSinValidar(): Promise<number> {
        return this.getOrCreateEstadoJornada('Sin Validar');
    };
};
