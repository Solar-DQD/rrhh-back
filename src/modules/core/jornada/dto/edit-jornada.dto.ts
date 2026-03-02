import { IsNotEmpty, IsString } from "class-validator";

export class EditJornadaDto {
    id: number;
    entrada: string;
    salida: string;
    id_usuariomodificacion: number;
};

export class EditJornadaBodyDto {
    @IsString()
    @IsNotEmpty()
    entrada: string;

    @IsString()
    @IsNotEmpty()
    salida: string;
};
