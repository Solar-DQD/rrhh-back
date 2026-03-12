import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { TipoAusencia } from './entities/tipoausencia.entity';
import { EstadoParametroService } from '../estadoparametro/estadoparametro.service';
import { GetTiposAusenciaPaginatedDto, TiposAusenciaPaginatedResponseDto } from './dto/get-tiposausencia-paginated.dto';
import { CreateTipoAusenciaDto } from './dto/create-tipoausencia.dto';
import { EditTipoAusenciaDto } from './dto/edit-tipoausencia.dto';
import { DeactivateTipoAusenciaDto } from './dto/deactivate-tipoausencia.dto';

@Injectable()
export class TipoAusenciaService {
    private idCache: Map<string, number> = new Map();
    private cache: TipoAusencia[] | null = null;

    constructor(
        @InjectRepository(TipoAusencia)
        private tipoAusenciaRepository: Repository<TipoAusencia>,
        private estadoParametroService: EstadoParametroService
    ) { }

    //Get All
    async getTiposAusencia(): Promise<TipoAusencia[]> {
        if (this.cache) return this.cache;

        const id_estadoparametro = await this.estadoParametroService.getEstadoParametroBaja();

        this.cache = await this.tipoAusenciaRepository.find({
            where: { id_estadoparametro: Not(id_estadoparametro) },
            select: { id: true, nombre: true }
        });

        return this.cache;
    };

    //Helper
    private async getOrCreateTipoAusencia(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached !== undefined) return cached;

        let tipoAusencia = await this.tipoAusenciaRepository.findOne({
            select: { id: true, nombre: true },
            where: { nombre: nombre }
        });

        if (!tipoAusencia) {
            const id_estadoparametro = await this.estadoParametroService.getEstadoParametroActivo();

            tipoAusencia = this.tipoAusenciaRepository.create({ nombre: nombre, id_estadoparametro: id_estadoparametro });
            tipoAusencia = await this.tipoAusenciaRepository.save(tipoAusencia);

            this.cache = null;
        };

        this.idCache.set(tipoAusencia.nombre, tipoAusencia.id);

        return tipoAusencia.id;
    };

    //Get tipoAusencia Injustificada
    async getTipoAusenciaInjustificada(): Promise<number> {
        return this.getOrCreateTipoAusencia('Injustificada');
    };

    //Get tipoAusencia Pendiente
    async getTipoAusenciaPendiente(): Promise<number> {
        return this.getOrCreateTipoAusencia('Pendiente');
    };

    //Get tiposAusencia Paginated
    async getTiposAusenciaPaginated(params: GetTiposAusenciaPaginatedDto): Promise<TiposAusenciaPaginatedResponseDto> {
        const [tiposAusencia, totalTiposAusencia] = await this.tipoAusenciaRepository.findAndCount({
            relations: {
                estadoparametro: true
            },
            select: {
                id: true,
                nombre: true,
                estadoparametro: { nombre: true }
            },
            skip: params.page * params.limit,
            take: params.limit,
            order: { id: 'ASC' }
        });

        return {
            tiposAusencia: tiposAusencia.map(tipo => ({
                id: tipo.id,
                nombre: tipo.nombre,
                estadoparametro: tipo.estadoparametro?.nombre
            })),
            totalTiposAusencia: totalTiposAusencia
        };
    };

    //Deactivate tipoAusencia
    async deactivateTipoAusencia(params: DeactivateTipoAusenciaDto): Promise<void> {
        const id_estadoparametro = await this.estadoParametroService.getEstadoParametroBaja();

        const result = await this.tipoAusenciaRepository.update(
            {
                id: params.id,
                id_estadoparametro: Not(id_estadoparametro),
                nombre: Not(In(['Injustificada', 'Pendiente']))
            },
            {
                id_estadoparametro: id_estadoparametro
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`TipoAusencia with id ${params.id} not found or cannot be deactivated`);
        };

        this.cache = null;
    };

    //Edit tipoAusencia
    async editTipoAusencia(params: EditTipoAusenciaDto): Promise<void> {
        const id_estadoparametro = await this.estadoParametroService.getEstadoParametroBaja();

        const existing = await this.tipoAusenciaRepository.findOne({
            where: {
                id: Not(params.id),
                nombre: params.nombre,
                id_estadoparametro: Not(id_estadoparametro)
            }
        });

        if (existing) {
            throw new ConflictException(`TipoAusencia "${params.nombre}" already exists`);
        };

        const result = await this.tipoAusenciaRepository.update(
            {
                id: params.id,
                nombre: Not(In(['Injustificada', 'Pendiente'])),
                id_estadoparametro: Not(id_estadoparametro)
            },
            {
                nombre: params.nombre
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`TipoAusencia with id ${params.id} not found or cannot be edited`);
        };

        this.cache = null;
    };

    //Create tipoAusencia
    async createTipoAusencia(params: CreateTipoAusenciaDto): Promise<void> {
        let id_estadoparametro = await this.estadoParametroService.getEstadoParametroBaja();

        const existing = await this.tipoAusenciaRepository.findOne({
            where: {
                nombre: params.nombre,
                id_estadoparametro: Not(id_estadoparametro)
            }
        });

        if (existing) {
            throw new ConflictException(`TipoAusencia "${params.nombre}" already exists`);
        };

        id_estadoparametro = await this.estadoParametroService.getEstadoParametroActivo();

        const tipoAusencia = this.tipoAusenciaRepository.create({ nombre: params.nombre, id_estadoparametro: id_estadoparametro });
        await this.tipoAusenciaRepository.save(tipoAusencia);

        this.cache = null;
    };
};
