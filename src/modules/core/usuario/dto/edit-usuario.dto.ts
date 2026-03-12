import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export type EditUsuarioDto = {
    id: number;
    nombre: string;
    email: string;
    id_tipousuario: number;
};

export class EditUsuarioBodyDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @Type(() => Number)
    @IsNumber()
    
    id_tipousuario: number;
};