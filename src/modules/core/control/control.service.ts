import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Control } from './entities/control.entity';
import { Not, Repository } from 'typeorm';
import { ControlesPaginatedResponseDto, GetControlesPaginatedDto } from './dto/get-control-paginated.dto';
import { DeleteControlDto } from './dto/delete-control.dto';
import { EditControlDto } from './dto/edit-control.dto';
import { CreateControlDto } from './dto/create-control.dto';
import { GetControlesByProyectoDto } from './dto/get-control-proyecto.dto';

@Injectable()
export class ControlService {
    private controlesCache: Map<number, string[]> = new Map();
    private proyectosCache: number[] | null = null;

    constructor(
        @InjectRepository(Control)
        private controlRepository: Repository<Control>
    ) { }

    //Get control by proyecto
    async getControlesByProyecto(params: GetControlesByProyectoDto): Promise<string[]> {
        const cached = this.controlesCache.get(params.id_proyecto);

        if (cached !== undefined) return cached;

        const controles = await this.controlRepository.find({
            select: { serie: true },
            where: { id_proyecto: params.id_proyecto }
        });

        const series = controles.map(control => control.serie);

        this.controlesCache.set(params.id_proyecto, series);

        return series;
    };

    //Get control proyectos
    async getControlesProyectosIds(): Promise<number[]> {
        if (this.proyectosCache) return this.proyectosCache;

        const controles = await this.controlRepository
            .createQueryBuilder()
            .select('id_proyecto')
            .distinct(true)
            .getMany();

        this.proyectosCache = controles.map(control => control.id_proyecto);

        return this.proyectosCache;
    };

    //Get control paginated
    async getControlesPaginated(params: GetControlesPaginatedDto): Promise<ControlesPaginatedResponseDto> {
        const [controles, totalControles] = await this.controlRepository.findAndCount({
            relations: {
                proyecto: true
            },
            select: {
                id: true,
                serie: true,
                id_proyecto: true,
                proyecto: { nombre: true }
            },
            skip: params.page * params.limit,
            take: params.limit,
            order: { id_proyecto: 'ASC' }
        });

        return {
            controles: controles.map(control => ({
                id: control.id,
                serie: control.serie,
                id_proyecto: control.id_proyecto,
                proyectonombre: control.proyecto?.nombre
            })),
            totalControles: totalControles
        };
    };

    //Delete control
    async deleteControl(params: DeleteControlDto): Promise<void> {
        const control = await this.controlRepository.findOne({
            select: { id_proyecto: true },
            where: { id: params.id }
        });

        if (!control) {
            throw new NotFoundException(`Control with id ${params.id} not found`);
        };

        await this.controlRepository.delete({ id: params.id });

        this.controlesCache.delete(control.id_proyecto);

        const remaining = await this.controlRepository.count({
            where: { id_proyecto: control.id_proyecto }
        });

        if (remaining === 0) {
            this.proyectosCache = null;
        };
    };

    //Edit control
    async editControl(params: EditControlDto): Promise<void> {
        const [existing, control] = await Promise.all([
            this.controlRepository.findOne({
                where: { id: Not(params.id), serie: params.serie }
            }),
            this.controlRepository.findOne({
                select: { id: true, id_proyecto: true },
                where: { id: params.id }
            })
        ]);

        if (existing) {
            throw new ConflictException(`Control "${params.serie}" already exists`);
        };

        if (!control) {
            throw new NotFoundException(`Control with id ${params.id} not found or cannot be edited`);
        };

        await this.controlRepository.update({ id: params.id }, {
            serie: params.serie,
            id_proyecto: params.id_proyecto
        });

        this.controlesCache.delete(params.id_proyecto);

        if (control.id_proyecto !== params.id_proyecto) {
            this.controlesCache.delete(control.id_proyecto);
            const remaining = await this.controlRepository.count({
                where: { id_proyecto: control.id_proyecto }
            });
            if (remaining === 0) this.proyectosCache = null;
        };
    };

    //Create control
    async createControl(params: CreateControlDto): Promise<void> {
        const existing = await this.controlRepository.findOne({
            where: {
                serie: params.serie,
            }
        });

        if (existing) {
            throw new ConflictException(`Control "${params.serie}" already exists`);
        };

        const control = this.controlRepository.create({ serie: params.serie, id_proyecto: params.id_proyecto });
        await this.controlRepository.save(control);

        this.controlesCache.delete(params.id_proyecto);
        this.proyectosCache = null;
    };
};
