import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class EditTipoAusenciaDto {
    id: number;
    nombre: string;
};

export class EditTipoAusenciaBodyDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;
};