import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateJornadaManualBodyDto {
    @IsString()
    @IsNotEmpty()
    fecha: string;

    @IsString()
    @IsOptional()
    entrada?: string;

    @IsString()
    @IsOptional()
    salida?: string;

    @IsString()
    @IsOptional()
    entradaTarde?: string;

    @IsString()
    @IsOptional()
    salidaTarde?: string;

    @IsString()
    observacion: string;

    @Type(() => Number)
    @IsNumber()
    id_empleado: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    id_tipoausencia?: number;

    @Type(() => Number)
    @IsNumber()
    id_tipojornada: number;
};

export type CreateJornadaManualDto = {
    fecha: string;
    entrada?: string;
    salida?: string;
    entradaTarde?: string;
    salidaTarde?: string;
    observacion?: string;
    id_empleado: number;
    id_tipoausencia?: number;
    id_tipojornada: number;
    id_usuariocreacion: number;
};