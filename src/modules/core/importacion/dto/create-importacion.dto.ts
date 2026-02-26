import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateImportacionDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    filename: string;

    @IsNumber()
    @IsPositive()
    id_proyecto: number;

    @IsNumber()
    @IsPositive()
    id_estadoimportacion: number;

    @IsNumber()
    @IsPositive()
    id_tipoimportacion: number;

    @IsNumber()
    @IsPositive()
    id_usuariocreacion: number;
};