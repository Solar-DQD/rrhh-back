import { IsNumber,IsPositive, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmpleadoDto {
    @IsString()
    @IsNotEmpty()
    dni: string;

    @Type(() => Number)
    @IsNumber()
    legajo?: number;

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
    id_tipoempleado?: number;
};