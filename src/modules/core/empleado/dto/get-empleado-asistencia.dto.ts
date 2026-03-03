export type EmpleadoAsistenciaItemDto = {
    id: number;
    nombre: string;
    dni: string;
    id_tipoempleado: number;
    tipoempleado: string;
};

export type EmpleadosAsistenciaResponseDto = {
    empleados: EmpleadoAsistenciaItemDto[];
};