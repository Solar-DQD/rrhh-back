import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class EditProyectoDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    nomina: string;

    @IsNumber()
    @IsPositive()
    id_modalidadtrabajo: number;
}

export class EditProyectoBodyDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    nomina: string;

    @IsNumber()
    @IsPositive()
    id_modalidadtrabajo: number;
}