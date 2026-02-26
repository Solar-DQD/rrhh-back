import { IsNumber, IsPositive } from "class-validator";

export class GetControlesByProyectoDto {
    @IsNumber()
    @IsPositive()
    id_proyecto: number;
};
