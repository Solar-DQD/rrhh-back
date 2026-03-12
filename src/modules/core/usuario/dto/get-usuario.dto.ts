import { IsNumber, Min, Max, IsPositive, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsuariosDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsNumber()
    
    @Min(1)
    @Max(100)
    limit: number;

    @IsString()
    @IsNotEmpty()
    column: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(4)
    direction: string;

    @IsString()
    @IsNotEmpty()
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
    tipousuario: string;
    estadousuario: string;
};

export type UsuariosResponseDto = {
    usuarios: UsuarioItemDto[];
    totalUsuarios: number;
};