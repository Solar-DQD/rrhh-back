import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export type ImportJornadasProSoftDto = {
    id_tipojornada: number;
    file: Express.Multer.File;
    id_proyecto: number;
    id_usuariocreacion: number;
};

export class ImportJornadasProSoftBodyDto {
    @Type(() => Number)
    @IsNumber()
    id_tipojornada: number;

    @Type(() => Number)
    @IsNumber()
    id_proyecto: number;
};

export type ProcessJornadasProSoftDto = {
    id_proyecto: number;
    file: Express.Multer.File;
};