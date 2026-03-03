import { IsNumber,IsPositive, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetResumenByEmpleadosDto {
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

    @Transform(({ value }) => Array.isArray(value) ? value.map(Number) : [Number(value)])
    @IsArray()
    @IsNumber({}, { each: true })
    ids_proyecto: number[];
}; //PEDNING cleaning?

export type AusenciaResumen = {
    id: number;
    nombre: string;
    cantidad: string;
};

export type ObservacionResumen = {
    fecha: Date;
    texto: string;
};

export type ResumenesResponseDto = {
    legajo: number;
    empleado: string;
    suma_total: string;
    suma_total_normal: string;
    suma_total_50: string;
    suma_total_100: string;
    suma_total_feriado: string;
    suma_total_nocturno: string;
    ausencias: AusenciaResumen[];
    observaciones: ObservacionResumen[];
};