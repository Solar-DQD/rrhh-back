import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateControlDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    serie: string;

    @IsNumber()
    @IsPositive()
    id_proyecto: number;
};