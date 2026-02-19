import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsPositive } from 'class-validator';

export class CreateObservacionDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    texto: string;

    @IsNumber()
    @IsPositive()
    id_jornada: number;
};