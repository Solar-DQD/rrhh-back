export class GetResumenByEmpleadosDto {
    id_mes: number;
    quincena?: number;
    id_tipoempleado?: number;
    ids_proyecto: number[];
};

export type AusenciaResumen = {
    id: number;
    nombre: string;
    cantidad: string;
};

export type ObservacionResumen = {
    fecha: Date;
    texto: string;
};

export type ResumenesResponseDto = {
    legajo: number;
    empleado: string;
    suma_total: string;
    suma_total_normal: string;
    suma_total_50: string;
    suma_total_100: string;
    suma_total_feriado: string;
    suma_total_nocturno: string;
    ausencias: AusenciaResumen[];
    observaciones: ObservacionResumen[];
};