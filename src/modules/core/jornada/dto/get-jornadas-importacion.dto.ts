import { IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetJornadasByImportacionDto {
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

export class JornadasImportacionItemDto {
    id: number;
    fecha: string;
    entrada: string;
    salida: string;
    estadojornada: string;
    nombreempleado: string;
    id_tipoausencia: number;
    ausencia: boolean;
};

export class JornadasImportacionResponseDto {
    jornadas: JornadasImportacionItemDto[];
    totalJornadas: number;
};