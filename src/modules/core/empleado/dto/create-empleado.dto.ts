import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmpleadoDto {
    @IsString()
    @IsNotEmpty()
    dni: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    legajo?: number;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    id_proyecto?: number;

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    id_tipoempleado?: number;
};