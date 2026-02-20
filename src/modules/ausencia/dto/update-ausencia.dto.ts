import { IsNumber, IsPositive } from "class-validator";

export class CreateAusenciaDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsNumber()
    @IsPositive()
    id_tipoausencia: number;
};