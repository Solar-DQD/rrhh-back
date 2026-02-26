import { IsNumber, Min, Max, IsPositive, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsuariosDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(100)
    limit: number;

    @IsString()
    @IsNotEmpty()
    column: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(3)
    direction: string;

    @IsString()
    nombre: string;

    @Type(() => Number)
    @IsNumber()
    id_tipousuario: number;
};

export class UsuarioItemDto {
    id: number;
    nombre: string;
    email: string;
    id_tipousuario: number;
    tipousuario: string;
    estadousuario: string;
};

export class UsuariosResponseDto {
    usuarios: UsuarioItemDto[];
    totalUsuarios: number;
};