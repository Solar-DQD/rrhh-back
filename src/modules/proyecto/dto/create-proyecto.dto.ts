import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsPositive } from 'class-validator';

export class CreateProyectoDto {
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
};