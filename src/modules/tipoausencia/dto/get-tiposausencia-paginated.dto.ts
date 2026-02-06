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

export class TipoAusenciaItemDto {
    id: number;
    nombre: string;
    estadoparametro?: string;
}

export class TiposAusenciaPaginatedResponseDto {
    tiposAusencia: TipoAusenciaItemDto[];
    totalTiposAusencia: number;
}