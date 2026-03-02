import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class DeleteControlDto {
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    id: number;
}