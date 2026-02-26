import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min } from "class-validator";
import { EmpleadoAsistenciaItemDto } from "src/modules/core/empleado/dto/get-empleado-asistencia.dto";

export class GetAsistenciaProyectoDto {
    @IsString()
    @IsNotEmpty()
    fecha: string;

    @Type(() => Number)
    @IsNumber()
    id_proyecto: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    page?: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(100)
    limit?: number;
};

export class AsistenciaResponseDto {
    totalMensuales: number;
    totalJornaleros: number;
    totalPresentes: number;
    totalAusentes: number;
    presentes: EmpleadoAsistenciaItemDto[];
    ausentes: EmpleadoAsistenciaItemDto[];
};