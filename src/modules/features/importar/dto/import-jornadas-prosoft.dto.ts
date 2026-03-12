import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export type ImportJornadasProSoftDto = {
    id_tipojornada: number;
    file: Express.Multer.File;
    id_proyecto: number;
    id_usuariocreacion: number;
};

export class ImportJornadasProSoftBodyDto {
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    id_tipojornada: number;

    @Transform(({ value }) => parseInt(value, 10)) 
    @IsNumber()
    id_proyecto: number;
};

export type ProcessJornadasProSoftDto = {
    id_proyecto: number;
    file: Express.Multer.File;
};