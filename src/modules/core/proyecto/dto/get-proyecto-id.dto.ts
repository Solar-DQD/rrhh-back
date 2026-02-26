import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class GetProyectoByIdDto {
    @Type(() => Number)
    @IsNumber()
    id: number;
};