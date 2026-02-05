import { Injectable, NotFoundException } from '@nestjs/common';
import { TipoUsuario } from './entities/tipousuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface GetTipoUsuarioPorIdParams {
    id: number;
};

@Injectable()
export class TipoUsuarioService {
    constructor(
        @InjectRepository(TipoUsuario)
        private tipoUsuarioRepository: Repository<TipoUsuario>
    ) { }

    //Get all
    async getTiposUsuario(): Promise<TipoUsuario[]> {
        return await this.tipoUsuarioRepository.find();
    };

    //Get by id
    async getTipoUsuarioPorId(params: GetTipoUsuarioPorIdParams): Promise<TipoUsuario> {
        const tipoUsuario = await this.tipoUsuarioRepository.findOne({
            where: { id: params.id }
        });

        if (!tipoUsuario) {
            throw new NotFoundException('TipoUsuario with id ' + params.id + ' not found');
        };

        return tipoUsuario;
    };
};
