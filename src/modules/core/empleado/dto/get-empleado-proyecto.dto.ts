import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetEmpleadoProyectoDto {
    @Type(() => Number)
    @IsNumber()
    id: number;
};