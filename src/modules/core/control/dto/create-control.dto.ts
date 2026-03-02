import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateControlDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    serie: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id_proyecto: number;
};