import { IsString, IsNotEmpty, MaxLength, IsNumber, IsPositive } from 'class-validator';

export class CreateProyectoDto {
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
};