import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class DeactivateUsuarioDto {
    @Type(() => Number)
    @IsNumber()
    id: number;
};