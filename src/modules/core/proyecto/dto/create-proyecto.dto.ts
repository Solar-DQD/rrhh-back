import { Type } from 'class-transformer';
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

    @Type(() => Number)
    @IsNumber()
    
    id_modalidadtrabajo: number;
};