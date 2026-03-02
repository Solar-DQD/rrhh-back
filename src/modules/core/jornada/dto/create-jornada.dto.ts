export class CreateJornadaDto {
    fecha: string;
    entrada?: string;
    salida?: string;
    id_empleado: number;
    id_proyecto: number;
    id_mes: number;
    id_quincena: number;
    id_tipojornada: number;
    id_ausencia?: number;
    id_estadojornada: number;
    id_importacion?: number;
    id_fuentemarca: number;
    id_usuariocreacion: number;
};