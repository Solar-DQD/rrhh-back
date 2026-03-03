import { IsNumber, Min, Max, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTiposAusenciaPaginatedDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(100)
    limit: number;
}

export type TipoAusenciaItemDto = {
    id: number;
    nombre: string;
    estadoparametro?: string;
}

export type TiposAusenciaPaginatedResponseDto = {
    tiposAusencia: TipoAusenciaItemDto[];
    totalTiposAusencia: number;
}