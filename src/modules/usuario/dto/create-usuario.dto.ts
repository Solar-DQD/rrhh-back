import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    correo: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    contraseña: string;

    @IsNumber()
    @IsPositive()
    id_tipousuario: number;
};