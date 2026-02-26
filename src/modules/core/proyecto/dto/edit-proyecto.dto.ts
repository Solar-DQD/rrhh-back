import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class EditProyectoDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @IsNotEmpty()
    
    @MaxLength(100)
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    
    @MaxLength(100)
    nomina: string;

    @IsNumber()
    @IsPositive()
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

    @IsNumber()
    @IsPositive()
    id_modalidadtrabajo: number;
}