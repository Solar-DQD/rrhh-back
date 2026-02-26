import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuenteMarca } from './entities/fuentemarca.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FuenteMarcaService {
    private idCache: Map<string, number> = new Map();

    constructor(
        @InjectRepository(FuenteMarca)
        private fuenteMarcaRepository: Repository<FuenteMarca>
    ) { }

    //helper
    private async getOrCreateFuenteMarca(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached) return cached;

        let fuenteMarca = await this.fuenteMarcaRepository.findOne({
            where: { nombre: nombre }
        });

        if (!fuenteMarca) {
            fuenteMarca = this.fuenteMarcaRepository.create({ nombre: nombre });
            fuenteMarca = await this.fuenteMarcaRepository.save(fuenteMarca);
        };

        this.idCache.set(nombre, fuenteMarca.id);

        return fuenteMarca.id;
    };

    //Get fuenteMarca manual
    async getFuenteMarcaManual(): Promise<number> {
        return this.getOrCreateFuenteMarca('Manual');
    };

    //Get fuenteMarca control
    async getFuenteMarcaControl(): Promise<number> {
        return this.getOrCreateFuenteMarca('Control de Acceso');
    };
};
