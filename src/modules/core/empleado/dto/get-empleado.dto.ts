import { IsNumber, Min, Max, IsPositive, IsBoolean, IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetEmpleadosDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(100)
    limit: number;

    @IsString()
    @IsNotEmpty()
    column: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(4)
    direction: string;

    @IsString()
    @IsOptional()
    nombre?: string;

    @Type(() => Number)
    @IsNumber()
    
    legajo?: number;

    @Type(() => Number)
    @IsNumber()
    
    id_proyecto?: number;

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
    id_tipoempleado?: number;

    @Type(() => Number)
    @IsNumber()
    id_tipoausencia: number;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    @IsOptional()
    manual?: boolean;
};

export type EmpleadoItemDto = {
    id: number;
    nombre: string;
    dni: string;
    legajo: number;
    id_proyecto: number;
    id_estadoempleado: number;
    estadoempleado: string;
    id_tipoempleado: number;
    tipoempleado: string;
    id_modalidadvalidacion: number;
    modalidadvalidacion: string;
    es_mensualizado: boolean;
};

export type EmpleadosResponseDto = {
    empleados: EmpleadoItemDto[];
    totalEmpleados: number;
};