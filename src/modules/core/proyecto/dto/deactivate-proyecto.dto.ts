import { IsNumber, IsPositive } from 'class-validator';

export class DeactivateProyectoDto {
    @IsNumber()
    @IsPositive()
    id: number;
}