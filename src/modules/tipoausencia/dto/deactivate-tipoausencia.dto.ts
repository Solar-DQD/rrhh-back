import { IsNumber, IsPositive } from 'class-validator';

export class DeactivateTipoAusenciaDto {
    @IsNumber()
    @IsPositive()
    id: number;
}