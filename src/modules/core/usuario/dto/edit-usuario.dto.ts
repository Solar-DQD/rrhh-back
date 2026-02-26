import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class EditUsuarioDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;

    @IsNumber()
    @IsPositive()
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

    @IsNumber()
    @IsPositive()
    id_tipousuario: number;
};