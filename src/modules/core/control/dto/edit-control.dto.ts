import { Type } from 'class-transformer';
import { IsNumber, IsPositive, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class EditControlDto {
    id: number;
    serie: string;
    id_proyecto: number;
};

export class EditControlBodyDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    serie: string;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id_proyecto: number;
};