import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoImportacion } from './entities/tipoimportacion.entity';

@Injectable()
export class TipoImportacionService {
    private idCache: Map<string, number> = new Map();
    private cache: TipoImportacion[] | null = null;

    constructor(
        @InjectRepository(TipoImportacion)
        private tipoImportacionRepository: Repository<TipoImportacion>
    ) { }

    //Get all
    async getTiposImportacion(): Promise<TipoImportacion[]> {
        if (this.cache) return this.cache;

        this.cache = await this.tipoImportacionRepository.find();

        this.cache.forEach(tipo => {
            this.idCache.set(tipo.nombre, tipo.id);
        });

        return this.cache;
    };

    //helper
    private async getOrCreateTipoImportacion(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached !== undefined) return cached;

        let tipoImportacion = await this.tipoImportacionRepository.findOne({
            where: { nombre: nombre }
        });

        if (!tipoImportacion) {
            tipoImportacion = this.tipoImportacionRepository.create({ nombre: nombre });
            tipoImportacion = await this.tipoImportacionRepository.save(tipoImportacion);

            this.cache = null;
        };

        this.idCache.set(nombre, tipoImportacion.id);

        return tipoImportacion.id;
    };

    //Get tipo importacion ProSoft
    async getTipoImportacionProSoft(): Promise<number> {
        return this.getOrCreateTipoImportacion('ProSoft');
    };

    //Get tipo importacion Ausentes
    async getTipoImportacionAusentes(): Promise<number> {
        return this.getOrCreateTipoImportacion('Ausentes');
    };
};
