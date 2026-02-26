import { IsNumber, IsPositive } from 'class-validator';

export class DeleteControlDto {
    @IsNumber()
    @IsPositive()
    id: number;
}