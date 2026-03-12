import { Injectable } from '@nestjs/common';
import { AsistenciaService } from '../asistencia/asistencia.service';
import { ExcelService } from '../excel/excel.service';
import { ProyectoService } from 'src/modules/core/proyecto/proyecto.service';
import { ExcelAsistenciaResponseDto } from '../excel/dto/generate-excel-asistencia.dto';
import { ExportAsistenciaDto } from './dto/export-asistencia.dto';
import { ExportResumenDto } from './dto/export-resumen.dto';
import { ExcelResumenResponseDto } from '../excel/dto/generate-excel-resumen.dto';
import { JornadaService } from 'src/modules/core/jornada/jornada.service';
import { MesService } from 'src/modules/core/mes/mes.service';
import { Mes } from 'src/modules/core/mes/entities/mes.entity';
import { Proyecto } from 'src/modules/core/proyecto/entities/proyecto.entity';
import { TipoEmpleadoService } from 'src/modules/core/tipoempleado/tipoempleado.service';
import { TipoEmpleado } from 'src/modules/core/tipoempleado/entities/tipoempleado.entity';

@Injectable()
export class ExportarService {
    constructor(
        private readonly asistenciaService: AsistenciaService,
        private readonly excelService: ExcelService,
        private readonly proyectoService: ProyectoService,
        private readonly jornadaService: JornadaService,
        private readonly mesService: MesService,
        private readonly tipoEmpleadoService: TipoEmpleadoService
    ) { }

    async exportAsistencia(params: ExportAsistenciaDto): Promise<ExcelAsistenciaResponseDto> {
        const fecha = params.fecha.split('-').reverse().join('-');

        const asistencia = await this.asistenciaService.getAsistenciaProyecto({ fecha: fecha, id_proyecto: params.id_proyecto });

        const presentes = asistencia.presentes.map(presente => ({
            dni: presente.dni,
            nombre: presente.nombre
        }));

        const ausentes = asistencia.ausentes.map(ausente => ({
            dni: ausente.dni,
            nombre: ausente.nombre
        }));

        const reporte = await this.excelService.generateExcelAsistencia({ presentes: presentes, ausentes: ausentes });

        const uint8Reporte = new Uint8Array(reporte);

        const proyecto = await this.proyectoService.getProyectoNombre({ id: params.id_proyecto });

        return {
            reporte: uint8Reporte,
            nombre: `Listado de Presentes y Ausentes - ${proyecto} - ${params.fecha}.xlsx`
        };
    };

    async exportResumen(params: ExportResumenDto): Promise<ExcelResumenResponseDto> {
        const resumen = await this.jornadaService.getResumenByEmpleados(params);

        const reporte = await this.excelService.generateExcelResumen({ resumen });

        const uint8Reporte = new Uint8Array(reporte);

        const nombre = await this.getResumenNombre(params);

        return {
            reporte: uint8Reporte,
            nombre: nombre
        };
    };

    private async getResumenNombre(params: ExportResumenDto): Promise<string> {
        const meses = await this.mesService.getMeses();
        const proyectos = await this.proyectoService.getProyectos();
        const tipos = await this.tipoEmpleadoService.getTiposEmpleado();

        const mes = meses.find((mes: Mes) => mes.id === params.id_mes);
        const proyecto = proyectos.find((proyecto: Proyecto) => proyecto.id === params.ids_proyecto[0]);
        const tipo = params.id_tipoempleado
            ? tipos.find((tipo: TipoEmpleado) => tipo.id === params.id_tipoempleado)
            : null;

        const getNombreMes = (mes: number): string => {
            const meses = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            return meses[mes - 1] ?? '';
        };

        const partes = [
            'Resumen Horas',
            params.ids_proyecto.length > 1 ? 'Multiples Proyectos' : proyecto!.nombre,
            tipo ? tipo.nombre : null,
            params.quincena ? `Quincena ${params.quincena}` : null,
            `${getNombreMes(mes!.mes)} de ${mes!.id_año}`
        ].filter(Boolean);

        return partes.join(' - ') + '.xlsx';
    };
};
