import { IsNumber, IsPositive, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class EditTipoAusenciaDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @IsNotEmpty()
    
    @MaxLength(100)
    nombre: string;
};

export class EditTipoAusenciaBodyDto {
    @IsString()
    @IsNotEmpty()
    
    @MaxLength(100)
    nombre: string;
};