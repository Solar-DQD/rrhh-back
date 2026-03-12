import { IsNotEmpty, IsString } from "class-validator";

export type CreateObservacionDto = {
    texto: string;
    id_jornada: number;
};

export class CreateObservacionBodyDto {
    @IsString()
    @IsNotEmpty()
    texto: string;
};
