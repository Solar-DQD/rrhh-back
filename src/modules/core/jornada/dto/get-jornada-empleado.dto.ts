import { IsNumber, Min, Max, IsPositive, IsBoolean, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export type GetJornadasByEmpleadoDto = {
    page: number;
    limit: number;
    id_empleado: number;
    id_mes?: number;
    quincena?: number;
    id_tipoausencia?: number;
    incompletas?: boolean;
    ausencias?: boolean;
};

export class GetJornadasByEmpleadoQueryDto {
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
    id_mes?: number;

    @Type(() => Number)
    @IsNumber()
    
    @IsOptional()
    quincena?: number;

    @Type(() => Number)
    @IsNumber()
    
    @IsOptional()
    id_tipoausencia?: number;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    @IsOptional()
    incompletas?: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    @IsOptional()
    ausencias?: boolean;
};

export type JornadaItemDto = {
    id: number;
    fecha: Date;
    entrada: string;
    salida: string;
    entrada_r: string;
    salida_r: string;
    total: number;
    tipojornada: string;
    tipoausencia: string;
    es_manual: boolean;
    observaciones: string[];
};

export type JornadaResponseDto = {
    jornadas: JornadaItemDto[];
    totalJornadas: number;
};