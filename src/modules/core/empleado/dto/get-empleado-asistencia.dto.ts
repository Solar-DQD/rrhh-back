export class EmpleadoAsistenciaItemDto {
    id: number;
    nombre: string;
    dni: bigint;
    id_tipoempleado: number;
    tipoempleado: string;
};

export class EmpleadosAsistenciaResponseDto {
    empleados: EmpleadoAsistenciaItemDto[];
};