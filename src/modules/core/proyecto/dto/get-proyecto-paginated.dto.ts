import { IsNumber, Min, Max, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProyectosPaginatedDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(100)
    limit: number;
};

export type ProyectoItemDto = {
    id: number;
    nombre: string;
    nomina: string;
    modalidadtrabajo: string;
    estadoparametro: string;
    id_modalidadtrabajo: number;
};

export type ProyectosPaginatedResponseDto = {
    proyectos: ProyectoItemDto[];
    totalProyectos: number;
};