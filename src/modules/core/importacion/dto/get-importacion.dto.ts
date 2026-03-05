import { IsNumber, Min, Max, IsPositive, IsBoolean, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetImportacionesDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(100)
    limit: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    id_proyecto?: number;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    incompletas: boolean;
};

export type ImportacionItemDto = {
    id: number;
    fecha: string;
    nombre: string;
    nombreestado: string;
    nombreusuario: string;
    nombreproyecto: string;
};

export type ImportacionesResponseDto = {
    importaciones: ImportacionItemDto[];
    totalImportaciones: number;
};