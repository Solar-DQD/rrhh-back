import { IsNumber, IsPositive, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Observacion } from '../../observacion/entities/observacion.entity';

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
    observaciones: Observacion[];
};

export type JornadasImportacionResponseDto = {
    jornadas: JornadasImportacionItemDto[];
    totalJornadas: number;
};