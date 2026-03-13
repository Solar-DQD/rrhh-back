import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ImportarService } from '../importar/importar.service';
import { FeriadosUtil } from './feriados.util';

export interface ImportResult {
    proyecto: number;
    success: boolean;
    error?: string;
}

@Injectable()
export class ImportCronService {
    private readonly logger = new Logger(ImportCronService.name);

    private readonly PROYECTOS = [1, 2, 3, 6, 9, 10, 11, 12, 17, 15, 18, 19];

    private readonly SYSTEM_USER_ID = 9;

    constructor(
        private readonly importarService: ImportarService,
        private readonly feriadosUtil: FeriadosUtil,
    ) { }

    @Cron('30 6 * * *', {
        name: 'import-jornadas',
        timeZone: 'America/Argentina/Buenos_Aires'
    })
    async handleImport() {
        this.logger.log('-'.repeat(25));
        this.logger.log('Starting scheduled jornada import');
        this.logger.log('-'.repeat(25));

        try {
            const results = await this.autoImport();

            // Log summary
            const successful = results.filter((r) => r.success).length;
            const failed = results.length - successful;

            this.logger.log('-'.repeat(25));
            this.logger.log('Import Summary:');
            this.logger.log(`  Total proyectos: ${results.length}`);
            this.logger.log(`  Successful: ${successful}`);
            this.logger.log(`  Failed: ${failed}`);

            if (failed > 0) {
                this.logger.warn('Failed proyectos:');
                results
                    .filter((r) => !r.success)
                    .forEach((r) => {
                        this.logger.warn(`  - Proyecto ${r.proyecto}: ${r.error || 'Unknown error'}`);
                    });
            }

            this.logger.log('-'.repeat(25));
            this.logger.log('Import completed');
            this.logger.log('-'.repeat(25));

            return results;
        } catch (error) {
            this.logger.error('Error in Import:');
            this.logger.error(error.message);
            this.logger.error(error.stack);
            throw error;
        };
    };

    private async autoImport(): Promise<ImportResult[]> {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const fecha = this.formatDate(yesterday);

        const feriadosList = await this.feriadosUtil.getFeriados();

        const isHoliday = this.feriadosUtil.isFeriado(yesterday, feriadosList);
        const id_tipojornada = isHoliday ? 5 : 1;

        this.logger.log(`Date: ${fecha}`);
        this.logger.log(`Is Feriado: ${isHoliday}`);
        this.logger.log(`Using id_tipojornada: ${id_tipojornada}`);
        this.logger.log(`Total proyectos: ${this.PROYECTOS.length}`);

        const results: ImportResult[] = [];

        for (const id_proyecto of this.PROYECTOS) {
            const result = await this.importJornadasForProyecto(
                id_proyecto,
                fecha,
                id_tipojornada,
            );
            results.push(result);
        };

        return results;
    };

    private async importJornadasForProyecto(
        id_proyecto: number,
        fecha: string,
        id_tipojornada: number,
    ): Promise<ImportResult> {
        try {
            this.logger.log(`→ Processing proyecto ${id_proyecto} (tipo: ${id_tipojornada})...`);

            await this.importarService.importJornadasHikVision({
                id_proyecto,
                id_tipojornada,
                fecha,
                id_usuariocreacion: this.SYSTEM_USER_ID,
            });

            this.logger.log(`Proyecto ${id_proyecto} completed successfully`);

            return {
                proyecto: id_proyecto,
                success: true,
            };
        } catch (error) {
            this.logger.error(`Error in proyecto ${id_proyecto}: ${error.message}`);

            return {
                proyecto: id_proyecto,
                success: false,
                error: error.message,
            };
        };
    };

    private formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    async manualImport() {
        this.logger.log('Manual Import triggered');
        return this.handleImport();
    };
};