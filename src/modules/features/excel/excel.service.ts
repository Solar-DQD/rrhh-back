import { BadRequestException, Injectable } from "@nestjs/common";
import * as ExcelJS from 'exceljs';
import { EmpleadoExcel, GenerateExcelAsistenciaDto } from "./dto/generate-excel-asistencia.dto";
import { GenerateExcelResumenDto } from "./dto/generate-excel-resumen.dto";
import { ResumenesResponseDto } from "src/modules/core/jornada/dto/get-resumen-empleados.dto";

@Injectable()
export class ExcelService {

    //Import
    async parseExcelFile(file: Express.Multer.File): Promise<Map<string, { nombre: string, registros: { fecha: string, hora: string, fechaHora: Date }[] }>> {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer.buffer as ArrayBuffer);
        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            throw new BadRequestException('No worksheet found in file');
        };

        const empleadosAccesos = new Map<string, {
            nombre: string,
            registros: { fecha: string, hora: string, fechaHora: Date }[]
        }>();

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber <= 6) return;

            const fechaRaw = row.getCell(2).value;
            const horaRaw = row.getCell(3).value;
            const dni = row.getCell(7).text?.trim();
            const nombre = row.getCell(8).text?.trim();

            if (!dni || !nombre || !fechaRaw || !horaRaw) return;

            const fecha = this.extractDate(fechaRaw);
            const hora = this.extractTime(horaRaw);

            if (!fecha || !hora) return;

            if (!empleadosAccesos.has(dni)) {
                empleadosAccesos.set(dni, { nombre, registros: [] });
            };

            empleadosAccesos.get(dni)!.registros.push({
                fecha,
                hora,
                fechaHora: new Date(`${fecha}T${hora}:00`)
            });
        });

        return empleadosAccesos;
    };

    private extractDate(cellValue: any): string {
        if (!cellValue) return '';

        if (cellValue instanceof Date) {
            return cellValue.toISOString().split('T')[0];
        };

        if (typeof cellValue === 'number') {
            const date = this.excelDateToJSDate(cellValue);
            return date.toISOString().split('T')[0];
        };

        const str = String(cellValue).trim();
        if (str.includes('/')) {
            const parts = str.split(' ')[0].split('/');
            if (parts.length === 3) {
                let [day, month, year] = parts;
                if (year.length === 2) {
                    const currentCentury = Math.floor(new Date().getFullYear() / 100) * 100;
                    year = String(currentCentury + parseInt(year));
                };
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            };
        };

        return str.split(' ')[0];
    };

    private extractTime(cellValue: any): string {
        if (!cellValue) return '';

        if (cellValue instanceof Date) {
            const hours = cellValue.getHours();
            const minutes = cellValue.getMinutes();

            let correctedHours = hours;
            let correctedMinutes = minutes;

            if (correctedMinutes >= 60) {
                correctedMinutes -= 60;
                correctedHours += 1;
            };

            if (correctedHours >= 24) {
                correctedHours -= 24;
            };

            return `${correctedHours.toString().padStart(2, '0')}:${correctedMinutes.toString().padStart(2, '0')}`;
        };

        if (typeof cellValue === 'number') {
            const fractional = cellValue < 1 ? cellValue : cellValue - Math.floor(cellValue);
            const totalSeconds = Math.round(86400 * fractional);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };

        const str = String(cellValue).trim();
        const parts = str.split(' ');
        return parts.length > 1 ? parts[1] : str;
    };

    private excelDateToJSDate(serial: number): Date {
        const utcDays = Math.floor(serial - 25569);
        const utcValue = utcDays * 86400;
        const fractionalDay = serial - Math.floor(serial);

        const date = new Date(utcValue * 1000);

        const totalSeconds = Math.floor(86400 * fractionalDay);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        date.setUTCHours(hours, minutes, seconds, 0);
        return date;
    };

    //Asistencia
    async generateExcelAsistencia(params: GenerateExcelAsistenciaDto): Promise<ExcelJS.Buffer> {
        const workbook = new ExcelJS.Workbook();

        workbook.creator = 'Sistema de Control de Accesos';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.description = 'Reporte de Empleados Presentes y Ausentes';

        this.addPresentesSheet(workbook, params.presentes);
        this.addAusentesSheet(workbook, params.ausentes);
        this.addInfoSheet(workbook, params.presentes.length, params.ausentes.length);

        return workbook.xlsx.writeBuffer();
    };

    private addPresentesSheet(workbook: ExcelJS.Workbook, presentes: EmpleadoExcel[]): void {
        const ws = workbook.addWorksheet('Presentes');

        ws.columns = [
            { header: 'ID Empleado', key: 'id_empleado', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 50 }
        ];

        presentes.forEach(p => ws.addRow({ id_empleado: p.dni, nombre: p.nombre }));

        this.styleHeaderRow(ws.getRow(1), '2F5597');
        this.styleDataRows(ws, 'F8F9FA');

        ws.addRow({});
        this.styleTotalRow(ws.addRow({ id_empleado: '', nombre: 'TOTAL: ' + presentes.length }), 'FFFACD');

        ws.autoFilter = { from: 'A1', to: `B${presentes.length + 1}` };
        ws.views = [{ state: 'frozen', ySplit: 1 }];
    };

    private addAusentesSheet(workbook: ExcelJS.Workbook, ausentes: EmpleadoExcel[]): void {
        const ws = workbook.addWorksheet('Ausentes');

        ws.columns = [
            { header: 'ID Empleado', key: 'id_empleado', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 50 }
        ];

        ausentes.forEach(a => ws.addRow({ id_empleado: a.dni, nombre: a.nombre }));

        this.styleHeaderRow(ws.getRow(1), 'C00000');
        this.styleDataRows(ws, 'FFE6E6');

        ws.addRow({});
        this.styleTotalRow(ws.addRow({ id_empleado: '', nombre: 'TOTAL: ' + ausentes.length }), 'FFCCCC');

        ws.autoFilter = { from: 'A1', to: `B${ausentes.length + 1}` };
        ws.views = [{ state: 'frozen', ySplit: 1 }];
    };

    private addInfoSheet(workbook: ExcelJS.Workbook, totalPresentes: number, totalAusentes: number): void {
        const ws = workbook.addWorksheet('Información');

        ws.addRow(['Reporte generado:', new Date().toLocaleString('es-AR')]);
        ws.addRow(['Total de empleados presentes:', totalPresentes]);
        ws.addRow(['Total de empleados ausentes:', totalAusentes]);
        ws.addRow(['Total general:', totalPresentes + totalAusentes]);

        ws.getColumn(1).width = 30;
        ws.getColumn(2).width = 25;
        ws.eachRow(row => row.getCell(1).font = { bold: true });
    };

    private styleHeaderRow(row: ExcelJS.Row, colorArgb: string): void {
        row.height = 25;
        row.eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorArgb } };
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } }
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        });
    };

    private styleDataRows(ws: ExcelJS.Worksheet, alternateColorArgb: string): void {
        ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;

            row.height = 20;

            if (rowNumber % 2 === 0) {
                row.eachCell(cell => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: alternateColorArgb } };
                });
            };

            row.eachCell((cell, colNumber) => {
                cell.border = {
                    top: { style: 'thin', color: { argb: 'CCCCCC' } },
                    left: { style: 'thin', color: { argb: 'CCCCCC' } },
                    bottom: { style: 'thin', color: { argb: 'CCCCCC' } },
                    right: { style: 'thin', color: { argb: 'CCCCCC' } }
                };
                cell.alignment = {
                    horizontal: colNumber === 1 ? 'center' : 'left',
                    vertical: 'middle'
                };
            });
        });
    };

    private styleTotalRow(row: ExcelJS.Row, colorArgb: string): void {
        row.height = 25;
        row.eachCell((cell, colNumber) => {
            cell.font = { bold: true, size: 11 };
            cell.border = {
                top: { style: 'double', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'double', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } }
            };
            if (colNumber === 2) {
                cell.alignment = { horizontal: 'left', vertical: 'middle' };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colorArgb } };
            };
        });
    };

    //Resumen
    async generateExcelResumen(params: GenerateExcelResumenDto): Promise<ExcelJS.Buffer> {
        const workbook = new ExcelJS.Workbook();

        workbook.creator = 'Sistema de Jornadas';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.description = 'Resumen de Jornadas de Trabajo';

        const tiposAusencias = this.collectTiposAusencias(params.resumen);

        this.addJornadasSheet(workbook, params.resumen, tiposAusencias);
        this.addObservacionesSheet(workbook, params.resumen);
        this.addJornadasInfoSheet(workbook, params.resumen.length, this.calcularTotales(params.resumen, tiposAusencias).suma_total);

        return workbook.xlsx.writeBuffer();
    };

    private collectTiposAusencias(resumen: ResumenesResponseDto[]): Map<number, string> {
        const tiposAusencias = new Map<number, string>();
        resumen.forEach(r => {
            r.ausencias?.forEach(a => {
                if (a.id && a.nombre) {
                    tiposAusencias.set(a.id, a.nombre);
                };
            });
        });
        return tiposAusencias;
    };

    private calcularTotales(resumen: ResumenesResponseDto[], tiposAusencias: Map<number, string>): any {
        const totales: any = {
            suma_total: 0,
            suma_total_normal: 0,
            suma_total_50: 0,
            suma_total_100: 0,
            suma_total_feriado: 0,
            suma_total_nocturno: 0,
        };

        tiposAusencias.forEach((_, id) => totales[`ausencia_${id}`] = 0);

        resumen.forEach(r => {
            totales.suma_total += parseFloat(r.suma_total.toString());
            totales.suma_total_normal += parseFloat(r.suma_total_normal.toString());
            totales.suma_total_50 += parseFloat(r.suma_total_50.toString());
            totales.suma_total_100 += parseFloat(r.suma_total_100.toString());
            totales.suma_total_feriado += parseFloat(r.suma_total_feriado.toString());
            totales.suma_total_nocturno += parseFloat(r.suma_total_nocturno.toString());
            tiposAusencias.forEach((_, id) => {
                const ausencia = r.ausencias?.find(a => a.id === id);
                totales[`ausencia_${id}`] += ausencia ? ausencia.cantidad : 0;
            });
        });

        return totales;
    };

    private addJornadasSheet(workbook: ExcelJS.Workbook, resumen: ResumenesResponseDto[], tiposAusencias: Map<number, string>): void {
        const ws = workbook.addWorksheet('Resumen de Jornadas');

        const columnasBase = [
            { header: 'Legajo', key: 'legajo', width: 15 },
            { header: 'Empleado', key: 'empleado', width: 50 },
            { header: 'Proyectos', key: 'proyectos', width: 40 }, // Add this
            { header: 'Total Horas', key: 'suma_total', width: 20 },
            { header: 'Horas Normales', key: 'suma_total_normal', width: 20 },
            { header: 'Horas 50%', key: 'suma_total_50', width: 20 },
            { header: 'Horas 100%', key: 'suma_total_100', width: 20 },
            { header: 'Horas Feriado', key: 'suma_total_feriado', width: 20 },
            { header: 'Horas Nocturnas', key: 'suma_total_nocturno', width: 20 },
        ];

        const columnasAusencias = Array.from(tiposAusencias.entries()).map(([id, nombre]) => ({
            header: `Ausencia: ${nombre}`,
            key: `ausencia_${id}`,
            width: 20
        }));

        ws.columns = [...columnasBase, ...columnasAusencias];

        resumen.forEach(r => {
            const fila: any = {
                legajo: r.legajo,
                empleado: r.empleado,
                proyectos: r.proyectos || '', // Add this
                suma_total: parseFloat(r.suma_total.toString()),
                suma_total_normal: parseFloat(r.suma_total_normal.toString()),
                suma_total_50: parseFloat(r.suma_total_50.toString()),
                suma_total_100: parseFloat(r.suma_total_100.toString()),
                suma_total_feriado: parseFloat(r.suma_total_feriado.toString()),
                suma_total_nocturno: parseFloat(r.suma_total_nocturno.toString()),
            };
            tiposAusencias.forEach((_, id) => {
                const ausencia = r.ausencias?.find(a => a.id === id);
                fila[`ausencia_${id}`] = ausencia ? ausencia.cantidad : 0;
            });
            ws.addRow(fila);
        });

        this.styleHeaderRow(ws.getRow(1), '2F5597');

        const numColumnasBase = columnasBase.length;

        ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return;
            row.height = 20;

            if (rowNumber % 2 === 0) {
                row.eachCell(cell => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8F9FA' } };
                });
            };

            row.eachCell((cell, colNumber) => {
                cell.border = {
                    top: { style: 'medium', color: { argb: 'CCCCCC' } },
                    left: { style: 'thin', color: { argb: 'CCCCCC' } },
                    bottom: { style: 'medium', color: { argb: 'CCCCCC' } },
                    right: { style: 'thin', color: { argb: 'CCCCCC' } }
                };
                if (colNumber === 1) {
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                } else if (colNumber === 2 || colNumber === 3) { // Update: both empleado and proyectos left-aligned
                    cell.alignment = { horizontal: 'left', vertical: 'middle' };
                } else {
                    cell.alignment = { horizontal: 'right', vertical: 'middle' };
                    cell.numFmt = colNumber <= numColumnasBase ? '0.00' : '0';
                };
            });
        });

        const totales = this.calcularTotales(resumen, tiposAusencias);

        const filaTotal: any = {
            legajo: '',
            empleado: 'TOTALES:',
            proyectos: '', // Add this
            ...Object.fromEntries(
                ['suma_total', 'suma_total_normal', 'suma_total_50', 'suma_total_100', 'suma_total_feriado', 'suma_total_nocturno']
                    .map(k => [k, totales[k]])
            )
        };
        tiposAusencias.forEach((_, id) => filaTotal[`ausencia_${id}`] = totales[`ausencia_${id}`]);

        ws.addRow({});
        const totalRow = ws.addRow(filaTotal);
        totalRow.height = 25;
        totalRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true, size: 11 };
            cell.border = {
                top: { style: 'double', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: '000000' } },
                bottom: { style: 'double', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: '000000' } }
            };
            if (colNumber === 2 || colNumber === 3) { // Update: handle proyectos column
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                if (colNumber === 2) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6F3FF' } };
                }
            } else if (colNumber > 3) { // Update: shift index
                cell.alignment = { horizontal: 'right', vertical: 'middle' };
                cell.numFmt = colNumber <= numColumnasBase ? '0.00' : '0';
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFACD' } };
            };
        });

        const totalColumnas = columnasBase.length + columnasAusencias.length;
        const letraColumna = String.fromCharCode(64 + totalColumnas);
        ws.autoFilter = { from: 'A1', to: `${letraColumna}${resumen.length + 1}` };
        ws.views = [{ state: 'frozen', ySplit: 1 }];
    };

    private addObservacionesSheet(workbook: ExcelJS.Workbook, resumen: ResumenesResponseDto[]): void {
        const ws = workbook.addWorksheet('Observaciones');
        ws.getColumn(1).width = 15;
        ws.getColumn(2).width = 50;
        ws.getColumn(3).width = 100;

        const headerRow = ws.addRow(['Legajo', 'Empleado', 'Observaciones']);
        this.styleHeaderRow(headerRow, '2F5597');

        resumen.forEach(r => {
            if (!r.observaciones?.length) return;

            const texto = r.observaciones.map(obs => `[${obs.fecha}] - ${obs.texto}`).join('\n');
            const row = ws.addRow([r.legajo, r.empleado, texto]);

            row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
            row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
            row.getCell(3).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
            row.height = Math.max(30, r.observaciones.length * 15);

            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'medium', color: { argb: 'CCCCCC' } },
                    left: { style: 'thin', color: { argb: 'CCCCCC' } },
                    bottom: { style: 'medium', color: { argb: 'CCCCCC' } },
                    right: { style: 'thin', color: { argb: 'CCCCCC' } }
                };
            });
        });

        if (ws.rowCount > 1) {
            ws.autoFilter = { from: 'A1', to: `C${ws.rowCount}` };
            ws.views = [{ state: 'frozen', ySplit: 1 }];
        };
    };

    private addJornadasInfoSheet(workbook: ExcelJS.Workbook, totalEmpleados: number, totalHoras: number): void {
        const ws = workbook.addWorksheet('Información');
        ws.addRow(['Reporte generado:', new Date().toLocaleString('es-AR')]);
        ws.addRow(['Total de empleados:', totalEmpleados]);
        ws.addRow(['Total de horas:', totalHoras]);
        ws.getColumn(1).width = 20;
        ws.getColumn(2).width = 25;
        ws.eachRow(row => row.getCell(1).font = { bold: true });
    };
};