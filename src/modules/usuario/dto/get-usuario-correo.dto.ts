import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class GetUsuarioByEmailDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    correo: string;
};