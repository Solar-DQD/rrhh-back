import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoImportacion } from './entities/estadoimportacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoImportacionService {
    private idCache: Map<string, number> = new Map();
    
    constructor(
        @InjectRepository(EstadoImportacion)
        private estadoImportacionRepository: Repository<EstadoImportacion>
    ) { }

    //helper
    async getOrCreateEstadoImportacion(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached) return cached;

        let estadoImportacion = await this.estadoImportacionRepository.findOne({
            where: { nombre: nombre }
        });

        if (!estadoImportacion) {
            estadoImportacion = this.estadoImportacionRepository.create({ nombre: nombre });
            estadoImportacion = await this.estadoImportacionRepository.save(estadoImportacion);
        };

        this.idCache.set(nombre, estadoImportacion.id);

        return estadoImportacion.id;
    };

    //Get estadoImportacion incompleta
    async getEstadoImportacionIncompleta(): Promise<number> {
        return this.getOrCreateEstadoImportacion('Incompleta');
    };

    //Get estadoImportacion revision
    async getEstadoImportacionRevision(): Promise<number> {
        return this.getOrCreateEstadoImportacion('Revision');
    };

    //Get estadoImportacion completa
    async getEstadoImportacionCompleta(): Promise<number> {
        return this.getOrCreateEstadoImportacion('Completa');
    };
};
