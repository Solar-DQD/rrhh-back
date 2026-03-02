import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateJornadaManualBodyDto {
    @IsString()
    @IsNotEmpty()
    fecha: string;

    @IsString()
    @IsNotEmpty()
    entrada: string;

    @IsString()
    @IsNotEmpty()
    salida: string;

    @IsString()
    @IsNotEmpty()
    entradaTarde: string;

    @IsString()
    @IsNotEmpty()
    salidaTarde: string;

    @IsString()
    @IsNotEmpty()
    observacion: string;

    @Type(() => Number)
    @IsNumber()
    id_empleado: number;

    @Type(() => Number)
    @IsNumber()
    id_tipoausencia: number;

    @Type(() => Number)
    @IsNumber()
    id_tipojornada: number;
};

export class CreateJornadaManualDto {
    fecha: string;
    entrada: string;
    salida: string;
    entradaTarde: string;
    salidaTarde: string;
    observacion: string;
    id_empleado: number;
    id_tipoausencia: number;
    id_tipojornada: number;
    id_usuariocreacion: number;
};