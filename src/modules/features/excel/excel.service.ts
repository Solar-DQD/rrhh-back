import { BadRequestException, Injectable } from "@nestjs/common";
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {

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

            let correctedHours = hours + 4;
            let correctedMinutes = minutes + 17;

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
};