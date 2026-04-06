import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { ILike, Not, Repository } from 'typeorm';
import { EstadoUsuarioService } from '../estadousuario/estadousuario.service';
import { GetUsuarioByEmailDto } from './dto/get-usuario-correo.dto';
import { GetUsuariosDto, UsuariosResponseDto } from './dto/get-usuario.dto';
import { DeactivateUsuarioDto } from './dto/deactivate-usuario.dto';
import { EditUsuarioDto } from './dto/edit-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import bcrypt from "bcrypt";
import { GetUsuarioProyectoDto } from './dto/get-usuario-proyecto.dto';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private estadoUsuarioService: EstadoUsuarioService
    ) { }

    //Get usuario by correo
    async getUsuarioByEmail(params: GetUsuarioByEmailDto): Promise<Usuario> {
        const id_estadousuario = await this.estadoUsuarioService.getEstadoUsuarioBaja();

        const usuario = await this.usuarioRepository.findOne({
            where: {
                email: ILike(params.email),
                id_estadousuario: Not(id_estadousuario)
            }
        });

        if (!usuario) {
            throw new NotFoundException(`Usuario with email ${params.email} not found`)
        };
        
        return usuario;
    };

    //Get usuario
    async getUsuarios(params: GetUsuariosDto): Promise<UsuariosResponseDto> {
        const upperCaseDirection = params.direction.toUpperCase() as 'ASC' | 'DESC';

        const query = this.usuarioRepository
            .createQueryBuilder('u')
            .select(['u.id', 'u.nombre', 'u.email', 'u.id_tipousuario', /**'u.id_proyecto',**/ 'tu.nombre', 'eu.nombre'])
            .innerJoin('u.tipousuario', 'tu')
            .innerJoin('u.estadousuario', 'eu')
            .take(params.limit)
            .skip(params.page * params.limit)
            .orderBy(`u.${params.column}`, upperCaseDirection);

        if (params.id_tipousuario !== undefined) {
            query.andWhere('u.id_tipousuario = :id_tipousuario', { id_tipousuario: params.id_tipousuario })
        };

        if (params.nombre !== '') {
            query.andWhere('unaccent(u.nombre) ILIKE unaccent(:nombre)', { nombre: `%${params.nombre}%` });
        };

        const [usuarios, totalUsuarios] = await query.getManyAndCount();

        return {
            usuarios: usuarios.map(usuario => ({
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                id_tipousuario: usuario.id_tipousuario,
                //id_proyecto: usuario.id_proyecto,
                tipousuario: usuario.tipousuario?.nombre,
                estadousuario: usuario.estadousuario?.nombre
            })),
            totalUsuarios
        };
    };

    //Get usuario proyecto
    /**async getUsuarioProyecto(params: GetUsuarioProyectoDto): Promise<number> {
        const usuario = await this.usuarioRepository.findOne({
            where: {
                id: params.id
            }
        });

        if (!usuario) {
            throw new NotFoundException(`Usuario with id ${params.id} not found`)
        };
        
        return usuario.id_proyecto;
    };**/

    //Deactivate usuario
    async deactivateUsuario(params: DeactivateUsuarioDto): Promise<void> {
        const id_estadousuario = await this.estadoUsuarioService.getEstadoUsuarioBaja();

        const result = await this.usuarioRepository.update(
            {
                id: params.id,
                id_estadousuario: Not(id_estadousuario)
            },
            {
                id_estadousuario: id_estadousuario
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Usuario with id ${params.id} not found or already deactivated`);
        };
    };

    //Edit usuario
    async editUsuario(params: EditUsuarioDto): Promise<void> {
        const id_estadousuario = await this.estadoUsuarioService.getEstadoUsuarioBaja();

        const existing = await this.usuarioRepository.findOne({
            where: {
                nombre: params.nombre,
                email: params.email,
                id_tipousuario: params.id_tipousuario,
                id: Not(params.id),
                id_estadousuario: Not(id_estadousuario)
            }
        });

        if (existing) {
            throw new ConflictException(`Usuario "${params.nombre}" and email "${params.email}" already exists`);
        };

        const result = await this.usuarioRepository.update(
            {
                id: params.id,
                id_estadousuario: Not(id_estadousuario)
            },
            {
                nombre: params.nombre,
                email: params.email,
                id_tipousuario: params.id_tipousuario,
                //id_proyecto: params.id_proyecto
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Usuario with id ${params.id} not found or cannot be edited`);
        };
    };

    //Create usuario
    async createUsuario(params: CreateUsuarioDto): Promise<number> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(params.contraseña, salt);

        const id_estadousuario = await this.estadoUsuarioService.getEstadoUsuarioActivo();

        let usuario = this.usuarioRepository.create({ email: params.email, nombre: params.nombre, contraseña: hash, id_tipousuario: params.id_tipousuario, id_estadousuario: id_estadousuario, /**id_proyecto: params.id_proyecto**/ });
        usuario = await this.usuarioRepository.save(usuario);

        return usuario.id;
    };
};
