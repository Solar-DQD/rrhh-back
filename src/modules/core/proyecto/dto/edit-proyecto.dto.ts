import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export type EditProyectoDto = {
    id: number;
    nombre: string;
    nomina: string;
    id_modalidadtrabajo: number;
}

export class EditProyectoBodyDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nomina: string;
    
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id_modalidadtrabajo: number;
}