import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";

export class ExportResumenDto {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    id_tipoempleado?: number;

    @Type(() => Number)
    @IsNumber()
    id_mes: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    quincena?: number;

    @Transform(({ value }) => Array.isArray(value) ? value.map(Number) : [Number(value)])
    @IsArray()
    @IsNumber({}, { each: true })
    ids_proyecto: number[];
};