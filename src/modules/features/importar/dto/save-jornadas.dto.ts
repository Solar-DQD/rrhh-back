export type Acceso = {
    fecha: string;
    hora: string;
    tipo: string;
};

export type AccesoOrdenado = {
    hora: string;
    tipo: string;
    orden: number;
};

export type AccesosPair = {
    entrada?: string;
    salida?: string;
};

export type EmpleadoAccesos = {
    nombre: string;
    validacionManual: boolean;
    accesos: Acceso[];
};

export type SaveProcesedJornadasDto = {
    id_tipoimportacion: number;
    id_tipojornada: number;
    id_proyecto: number;
    empleadosAccesos: Map<string, EmpleadoAccesos>;
    nombre: string;
    id_usuariocreacion: number;
};