import { IsNumber, Min, Max, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export type GetObservacionesByEmpleadoDto = {
    page: number;
    limit: number;
    quincena?: number;
    id_mes: number;
    id_empleado: number;
};

export class GetObservacionesByEmpleadoBodyDto {
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
    
    @Min(0)
    @Max(2)
    @IsOptional()
    quincena?: number;

    @Type(() => Number)
    @IsNumber()
    
    id_mes: number;
};

export type ObservacionItemDto = {
    id: number;
    texto: string;
    fecha: string;
};

export type ObservacionesByEmpleadoResponseDto = {
    observaciones: ObservacionItemDto[];
    totalObservaciones: number;
};