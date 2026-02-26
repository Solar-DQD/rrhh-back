import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class DeactivateEmpleadoDto {
    @Type(() => Number)
    @IsNumber()
    id: number;
};