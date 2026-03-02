import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class EditEmpleadoDto {
    id: number;
    id_modalidadvalidacion: number;
};

export class EditEmpleadoBodyDto {
    @Type(() => Number)
    @IsNumber()
    id_modalidadvalidacion: number;
};

export class EditEmpleadoSyncDto {
    id: number;
    legajo: number;
    nombre: string;
    id_proyecto: number;
    id_tipoempleado: number;
    id_estadoempleado: number;
    id_modalidadvalidacion: number;
};