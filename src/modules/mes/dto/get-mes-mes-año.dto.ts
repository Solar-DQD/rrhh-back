import { IsNumber, IsPositive } from "class-validator";

export class GetMesByMesAndAñoDto {
    @IsNumber()
    @IsPositive()
    id_año: number;

    @IsNumber()
    @IsPositive()
    mes: number;
}