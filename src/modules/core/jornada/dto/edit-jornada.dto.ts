import { IsNotEmpty, IsString } from "class-validator";

export type EditJornadaDto = {
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
