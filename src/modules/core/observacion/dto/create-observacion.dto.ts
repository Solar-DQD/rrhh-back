import { IsString, IsNotEmpty, MaxLength, IsNumber, IsPositive } from 'class-validator';

export class CreateObservacionDto {
    @IsString()
    @IsNotEmpty()
    
    @MaxLength(100)
    texto: string;

    @IsNumber()
    @IsPositive()
    id_jornada: number;
};