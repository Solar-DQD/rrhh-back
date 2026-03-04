export type EmpleadoExcel = {
    dni: string;
    nombre: string;
};

export type GenerateExcelAsistenciaDto = {
    presentes: EmpleadoExcel[];
    ausentes: EmpleadoExcel[];
};

export type ExcelAsistenciaResponseDto = {
    reporte: Uint8Array;
    nombre: string
};

