import { ResumenesResponseDto } from "src/modules/core/jornada/dto/get-resumen-empleados.dto";

export type GenerateExcelResumenDto = {
    resumen: ResumenesResponseDto[];
};

export type ExcelResumenResponseDto = {
    reporte: Uint8Array;
    nombre: string
};
