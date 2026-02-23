import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class SetEstadoImportacionCompletaDto {
    @Type(() => Number)
    @IsNumber()
    id: number;
};