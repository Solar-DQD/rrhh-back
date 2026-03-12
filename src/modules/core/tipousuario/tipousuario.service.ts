import { Injectable, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from './entities/tipousuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTipoUsuarioPorIdDto } from './dto/get-tipousuario-id.dto';

@Injectable()
export class TipoUsuarioService {
    private idCache: Map<number, TipoUsuario> = new Map();
    private cache: TipoUsuario[] | null = null;

    constructor(
        @InjectRepository(TipoUsuario)
        private tipoUsuarioRepository: Repository<TipoUsuario>
    ) { }

    //Get all
    async getTiposUsuario(): Promise<TipoUsuario[]> {
        if (this.cache) return this.cache;

        this.cache = await this.tipoUsuarioRepository.find();

        this.cache.forEach(tipoUsuario => {
            this.idCache.set(tipoUsuario.id, tipoUsuario);
        });

        return this.cache;
    };

    //Get tipoUsuario by id
    async getTipoUsuarioPorId(params: GetTipoUsuarioPorIdDto): Promise<TipoUsuario> {
        const cached = this.idCache.get(params.id);

        if (cached !== undefined) return cached;

        const tipoUsuario = await this.tipoUsuarioRepository.findOne({
            where: { id: params.id }
        });

        if (!tipoUsuario) {
            throw new NotFoundException(`TipoUsuario with id ${params.id} not found`);
        };

        this.idCache.set(tipoUsuario.id, tipoUsuario);

        return tipoUsuario;
    };
};
