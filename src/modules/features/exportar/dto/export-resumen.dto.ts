import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber } from "class-validator";

export class ExportResumenDto {
    @Type(() => Number)
    @IsNumber()
    id_tipoempleado?: number;

    @Type(() => Number)
    @IsNumber()
    id_mes: number;

    @Type(() => Number)
    @IsNumber()
    quincena?: number;

    @Transform(({ value }) => Array.isArray(value) ? value.map(Number) : [Number(value)])
    @IsArray()
    @IsNumber({}, { each: true })
    ids_proyecto: number[];
};