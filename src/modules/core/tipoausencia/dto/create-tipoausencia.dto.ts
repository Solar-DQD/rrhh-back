import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTipoAusenciaDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;
};
