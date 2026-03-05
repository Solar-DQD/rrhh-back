import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export type EditAusenciaDto = {
    id: number;
    id_tipoausencia: number;
};

export class EditAusenciaBodyDto {
    @Type(() => Number)
    @IsNumber()
    
    id_tipoausencia: number;
};