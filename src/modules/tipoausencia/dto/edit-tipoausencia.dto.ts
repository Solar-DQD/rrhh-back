import { IsNumber, IsPositive, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class EditTipoAusenciaDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    nombre: string;
}