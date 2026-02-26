import { IsNumber, IsPositive } from "class-validator";

export class GetAñoByValorDto {
    @IsNumber()
    @IsPositive()
    valor: number;
}