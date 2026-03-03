import { IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export type GetJornadasByImportacionDto = {
    page: number;
    limit: number;
    id_importacion: number;
};

export class GetJornadasByImportacionQueryDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(0)
    @Max(100)
    limit: number;
};

export type JornadasImportacionItemDto = {
    id: number;
    fecha: string;
    entrada: string;
    salida: string;
    estadojornada: string;
    nombreempleado: string;
    id_tipoausencia: number;
    ausencia: boolean;
};

export type JornadasImportacionResponseDto = {
    jornadas: JornadasImportacionItemDto[];
    totalJornadas: number;
};