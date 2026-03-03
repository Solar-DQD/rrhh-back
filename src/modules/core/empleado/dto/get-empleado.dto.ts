import { IsNumber, Min, Max, IsPositive, IsBoolean, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetEmpleadosDto {
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

    @IsString()
    @IsNotEmpty()
    column: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(4)
    direction: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    legajo: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id_proyecto: number;

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
    id_tipoempleado: number;

    @Type(() => Number)
    @IsNumber()
    id_tipoausencia: number;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    manual: boolean;
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