import { IsNumber, Min, Max, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class GetObservacionesByEmpleadoDto {
    page: number;
    limit: number;
    quincena: number;
    mes: number;
    id_empleado: number;
};

export class GetObservacionesByEmpleadoBodyDto {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(0)
    @Max(100)
    limit: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(0)
    @Max(2)
    quincena: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    mes: number;
};

export class ObservacionItemDto {
    id: number;
    texto: string;
    fecha: string;
};

export class ObservacionesByEmpleadoResponseDto {
    observaciones: ObservacionItemDto[];
    totalObservaciones: number;
};