import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoUsuario } from './entities/estadousuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoUsuarioService {
    private idCache: Map<string, number> = new Map();

    constructor(
        @InjectRepository(EstadoUsuario)
        private estadoUsuarioRepository: Repository<EstadoUsuario>
    ) { }

    //helper
    async getOrCreateEstadoUsuario(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached) return cached;

        let estadoUsuario = await this.estadoUsuarioRepository.findOne({
            where: { nombre: nombre }
        });

        if (!estadoUsuario) {
            estadoUsuario = this.estadoUsuarioRepository.create({ nombre: nombre });
            estadoUsuario = await this.estadoUsuarioRepository.save(estadoUsuario);
        };

        this.idCache.set(nombre, estadoUsuario.id);

        return estadoUsuario.id;
    };

    //Get estadoUsuario activo
    async getEstadoUsuarioActivo(): Promise<number> {
        return this.getOrCreateEstadoUsuario('Activo');
    };

    //Get estadoUsuario baja
    async getEstadoUsuarioBaja(): Promise<number> {
        return this.getOrCreateEstadoUsuario('Baja');
    };
};
