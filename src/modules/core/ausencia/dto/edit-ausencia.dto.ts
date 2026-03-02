import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class EditAusenciaDto {
    id: number;
    id_tipoausencia: number;
};

export class EditAusenciaBodyDto {
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id_tipoausencia: number;
};