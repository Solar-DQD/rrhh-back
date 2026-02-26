import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModalidadValidacion } from './entities/modalidadvalidacion.entity';

@Injectable()
export class ModalidadValidacionService {
    private idCache: Map<string, number> = new Map();
    private cache: ModalidadValidacion[] | null = null;

    constructor(
        @InjectRepository(ModalidadValidacion)
        private modalidadValidacionRepository: Repository<ModalidadValidacion>
    ) { }

    //Get all
    async getModalidadesValidacion(): Promise<ModalidadValidacion[]> {
        if (this.cache) return this.cache;

        this.cache = await this.modalidadValidacionRepository.find();

        this.cache.forEach(modalidadValidacion => {
            this.idCache.set(modalidadValidacion.nombre, modalidadValidacion.id);
        });

        return this.cache;
    };

    //helper
    private async getOrCreateModalidadValidacion(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached) return cached;

        let modalidadValidacion = await this.modalidadValidacionRepository.findOne({
            where: { nombre: nombre }
        });

        if (!modalidadValidacion) {
            modalidadValidacion = this.modalidadValidacionRepository.create({ nombre: nombre });
            modalidadValidacion = await this.modalidadValidacionRepository.save(modalidadValidacion);

            this.cache = null;
        };

        this.idCache.set(nombre, modalidadValidacion.id);

        return modalidadValidacion.id;
    };

    //Get modalidadRevision manual
    async getModalidadValidacionManual(): Promise<number> {
        return this.getOrCreateModalidadValidacion('Manual');
    };

    //Get modalidadRevision automatica
    async getModalidadValidacionAutomatica(): Promise<number> {
        return this.getOrCreateModalidadValidacion('Automatica');
    };
};
