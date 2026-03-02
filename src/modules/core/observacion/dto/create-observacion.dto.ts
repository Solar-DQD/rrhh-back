import { IsNotEmpty, IsString } from "class-validator";

export class CreateObservacionDto {
    texto: string;
    id_jornada: number;
};

export class CreateObservacionBodyDto {
    @IsString()
    @IsNotEmpty()
    texto: string;
};
