import { Injectable } from '@nestjs/common';
import { TipoEmpleado } from './entities/tipoempleado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TipoEmpleadoService {
    private idCache: Map<string, number> = new Map();
    private cache: TipoEmpleado[] | null = null;

    constructor(
        @InjectRepository(TipoEmpleado)
        private tipoEmpleadoRepository: Repository<TipoEmpleado>
    ) {}

    //Get all
    async getTiposEmpleado(): Promise<TipoEmpleado[]> {
        if (this.cache) return this.cache;

        this.cache = await this.tipoEmpleadoRepository.find();

        this.cache.forEach(tipo => {
            this.idCache.set(tipo.nombre, tipo.id);
        });

        return this.cache;
    };

    //helper
    private async getOrCreateTipoEmpleado(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached) return cached;

        let tipoEmpleado = await this.tipoEmpleadoRepository.findOne({
            where: { nombre: nombre }
        });

        if (!tipoEmpleado) {
            tipoEmpleado = this.tipoEmpleadoRepository.create({ nombre: nombre })
            tipoEmpleado = await this.tipoEmpleadoRepository.save(tipoEmpleado);

            this.cache = null;
        };

        this.idCache.set(nombre, tipoEmpleado.id);

        return tipoEmpleado.id;
    };

    //Get tipo empleado mensual
    async getTipoEmpleadoMensual(): Promise<number> {
        return this.getOrCreateTipoEmpleado('Mensual');
    };

    //Get tipo empleado jornalero
    async getTipoEmpleadoJornalero(): Promise<number> {
        return this.getOrCreateTipoEmpleado('Jornalero');
    };
};
