import { IsNumber, Min, Max, IsPositive, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetJornadasByEmpleadoDto {
    page: number;
    limit: number;
    id_empleado: number;
    id_mes: number;
    quincena: number;
    id_tipoausencia: number;
    incompletas: boolean;
    ausencias: boolean;
};

export class GetJornadasByEmpleadoQueryDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(0)
    @Max(100)
    limit: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id_mes: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    quincena: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id_tipoausencia: number;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    incompletas: boolean;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    ausencias: boolean;
};

export class JornadaItemDto {
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

export class JornadaResponseDto {
    jornadas: JornadaItemDto[];
    totalJornadas: number;
};