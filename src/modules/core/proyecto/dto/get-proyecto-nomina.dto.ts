import { IsNotEmpty, IsString } from "class-validator";

export class GetProyectoByNominaDto {
    @IsString()
    @IsNotEmpty()
    nomina: string;
};