import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AccesosReturn } from "src/modules/mssql/registros_acceso/dto/get-accesos.dto";

export type ImportJornadasHikVisionDto = {
    id_tipojornada: number;
    fecha: string;
    id_proyecto: number;
    id_usuariocreacion: number;
};

export class ImportJornadasHikVisionBodyDto {
    @Type(() => Number)
    @IsNumber()
    id_tipojornada: number;

    @IsString()
    @IsNotEmpty()
    fecha: string;

    @Type(() => Number)
    @IsNumber()
    id_proyecto: number;
};

export type ProcessJornadasHikVisionDto = {
    accesos: AccesosReturn[];
    id_proyecto: number;
};