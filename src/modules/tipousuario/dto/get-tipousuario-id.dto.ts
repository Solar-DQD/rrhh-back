import { IsNumber, IsPositive } from "class-validator";

export class GetTipoUsuarioPorIdDto {
    @IsNumber()
    @IsPositive()
    id: number;
}