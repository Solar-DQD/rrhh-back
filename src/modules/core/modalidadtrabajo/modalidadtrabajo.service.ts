import { Injectable } from '@nestjs/common';
import { ModalidadTrabajo } from './entities/modalidadtrabajo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ModalidadTrabajoService {
    private idCache: Map<string, number> = new Map();
    private cache: ModalidadTrabajo[] | null = null;

    constructor(
        @InjectRepository(ModalidadTrabajo)
        private modalidadTrabajoRepository: Repository<ModalidadTrabajo>
    ) { }

    //Get all
    async getModalidadesTrabajo(): Promise<ModalidadTrabajo[]> {
        if (this.cache) return this.cache;

        this.cache = await this.modalidadTrabajoRepository.find();

        this.cache.forEach(modalidadTrabajo => {
            this.idCache.set(modalidadTrabajo.nombre, modalidadTrabajo.id);
        });

        return this.cache;
    };

    //helper
    private async getOrCreateModalidadTrabajo(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached) return cached;

        let modalidadTrabajo = await this.modalidadTrabajoRepository.findOne({
            where: { nombre: nombre }
        });

        if (!modalidadTrabajo) {
            modalidadTrabajo = this.modalidadTrabajoRepository.create({ nombre: nombre });
            modalidadTrabajo = await this.modalidadTrabajoRepository.save(modalidadTrabajo);

            this.cache = null;
        };

        this.idCache.set(nombre, modalidadTrabajo.id);

        return modalidadTrabajo.id;
    };

    //Get modalidadTrabajo corrido
    async getModalidadTrabajoCorrido(): Promise<number> {
        return this.getOrCreateModalidadTrabajo('Jornada Completa');
    };

    //Get modalidadTrabajo partido
    async getModalidadTrabajoPartido(): Promise<number> {
        return this.getOrCreateModalidadTrabajo('Jornada Partida');
    };
};
