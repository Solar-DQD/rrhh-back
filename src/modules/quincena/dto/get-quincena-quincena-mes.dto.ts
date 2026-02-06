import { Type } from 'class-transformer';
import { IsNumber, IsPositive, Max, Min } from 'class-validator';

export class GetQuincenaByQuincenaAndMesDto {
    @IsNumber()
    @IsPositive()
    id_mes: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(2)
    quincena: number;
}