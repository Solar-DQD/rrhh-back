import { IsNumber, IsPositive, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class EditControlDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    serie: string;

    @IsNumber()
    @IsPositive()
    id_proyecto: number;
};

export class EditControlBodyDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    serie: string;

    @IsNumber()
    @IsPositive()
    id_proyecto: number;
};