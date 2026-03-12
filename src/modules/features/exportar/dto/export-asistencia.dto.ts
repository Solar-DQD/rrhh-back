import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ExportAsistenciaDto {
    @Type(() => Number)
    @IsNumber()
    id_proyecto: number;

    @IsString()
    @IsNotEmpty()
    fecha: string;
};