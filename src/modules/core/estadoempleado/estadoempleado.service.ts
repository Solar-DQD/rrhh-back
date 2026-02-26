import { Injectable } from '@nestjs/common';
import { EstadoEmpleado } from './entities/estadoempleado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoEmpleadoService {
    private idCache: Map<string, number> = new Map();

    constructor(
        @InjectRepository(EstadoEmpleado)
        private estadoEmpleadoRepository: Repository<EstadoEmpleado>
    ) { }

    //helper
    async getOrCreateEstadoEmpleado(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);
        
        if (cached) return cached;

        let estadoEmpleado = await this.estadoEmpleadoRepository.findOne({
            where: { nombre: nombre }
        });

        if (!estadoEmpleado) {
            estadoEmpleado = this.estadoEmpleadoRepository.create({ nombre: nombre });
            estadoEmpleado = await this.estadoEmpleadoRepository.save(estadoEmpleado);
        };

        this.idCache.set(nombre, estadoEmpleado.id);

        return estadoEmpleado.id;
    };

    //Get estadoEmpleado activo
    async getEstadoEmpleadoActivo(): Promise<number> {
        return this.getOrCreateEstadoEmpleado('Activo');
    };

    //Get estadoEmpleado baja
    async getEstadoEmpleadoBaja(): Promise<number> {
        return this.getOrCreateEstadoEmpleado('Baja');
    };
};
