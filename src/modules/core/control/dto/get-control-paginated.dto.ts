import { IsNumber, Min, Max, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetControlesPaginatedDto {
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

export type ControlesItemDto = {
    id: number;
    serie: string;
    id_proyecto: number;
    proyectonombre: string;
};

export type ControlesPaginatedResponseDto = {
    controles: ControlesItemDto[];
    totalControles: number;
};