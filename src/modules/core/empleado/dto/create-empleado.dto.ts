import { IsNumber,IsPositive, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmpleadoDto {
    @Type(() => Number)
    @IsNumber()
    dni: bigint;

    @Type(() => Number)
    @IsNumber()
    legajo: number;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id_proyecto: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id_tipoempleado: number;
};