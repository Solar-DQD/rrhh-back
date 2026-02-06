import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateTipoAusenciaDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    nombre: string;
};

export class EditTipoAusenciaBodyDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    nombre: string;
};