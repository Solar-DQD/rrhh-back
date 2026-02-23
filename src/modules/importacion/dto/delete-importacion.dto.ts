import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class DeleteImportacionDto {
    @Type(() => Number)
    @IsNumber()
    id: number;
};