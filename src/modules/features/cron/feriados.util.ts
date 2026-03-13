import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class FeriadosUtil {
    private readonly logger = new Logger(FeriadosUtil.name);

    constructor(
        @InjectDataSource('mssql') private readonly dataSource: DataSource,
    ) { }

    async getFeriados(): Promise<Date[]> {
        try {
            this.logger.log('Fetching feriados from database...');

            const results = await this.dataSource.query(
                'SELECT feriado FROM feriados WHERE feriado IS NOT NULL',
            );

            const feriados = results.map((row) => {
                const feriadoDate = row.feriado;
                return feriadoDate instanceof Date ? feriadoDate : new Date(feriadoDate);
            });

            if (feriados.length === 0) {
                this.logger.warn(
                    'WARNING: 0 feriados found - possible data issue, verify feriados DB table.',
                );
            };

            this.logger.log(`Found ${feriados.length} feriados in database`);
            return feriados;
        } catch (error) {
            this.logger.error(`Error fetching feriados: ${error.message}`);
            this.logger.warn('Continuing without feriado check...');
            return [];
        };
    };

    isFeriado(date: Date, feriadosList: Date[]): boolean {
        const dateString = this.dateToString(date);

        return feriadosList.some(
            (feriado) => this.dateToString(feriado) === dateString,
        );
    };

    private dateToString(date: Date): string {
        return date.toISOString().split('T')[0];
    };
};