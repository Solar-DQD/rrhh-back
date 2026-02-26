import { IsNumber, IsPositive, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class EditControlDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    serie: string;

    @IsNumber()
    @IsPositive()
    id_proyecto: number;
};

export class EditControlBodyDto {
    @IsString()
    @IsNotEmpty()
    
    @MaxLength(100)
    serie: string;

    @IsNumber()
    @IsPositive()
    id_proyecto: number;
};