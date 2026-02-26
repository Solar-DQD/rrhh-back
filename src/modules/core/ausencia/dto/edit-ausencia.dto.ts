import { IsNumber, IsPositive } from "class-validator";

export class EditAusenciaDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsNumber()
    @IsPositive()
    id_tipoausencia: number;
};