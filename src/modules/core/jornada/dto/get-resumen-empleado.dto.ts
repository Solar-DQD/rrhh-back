import { IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export type GetResumenByEmpleadoDto = {
    id_empleado: number;
    id_mes: number;
    quincena: number;
};

export class GetResumenByEmpleadoQueryDto {
    @Type(() => Number)
    @IsNumber()
    
    id_mes: number;

    @Type(() => Number)
    @IsNumber()
    
    quincena: number;
};

export type ResumenItemDto = {
    suma_total: number;
    suma_total_normal: number;
    suma_total_50: number;
    suma_total_100: number;
    suma_total_feriado: number;
    suma_total_nocturno: number;
    total_asistencias: number;
    total_ausencias_injustificadas: number;
    total_ausencias_justificadas: number;
};

export type ResumenResponseDto = {
    resumen: ResumenItemDto;
};