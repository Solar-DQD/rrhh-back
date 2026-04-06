import { IsNumber, Min, Max, IsPositive, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsuariosDto {
    @Type(() => Number)
    @IsNumber()
    page: number;

    @Type(() => Number)
    @IsNumber()
    limit: number;

    @IsString()
    @IsNotEmpty()
    column: string;

    @IsString()
    @IsNotEmpty()
    direction: string;

    @IsString()
    @IsOptional()
    nombre: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    id_tipousuario?: number;
};

export type UsuarioItemDto = {
    id: number;
    nombre: string;
    email: string;
    id_tipousuario: number;
    id_proyecto: number;
    tipousuario: string;
    estadousuario: string;
};

export type UsuariosResponseDto = {
    usuarios: UsuarioItemDto[];
    totalUsuarios: number;
};