import { Injectable, Logger } from '@nestjs/common';
import { SyncEmpleadosService } from '../syncempleados/syncempleados.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SyncCronService {
    private readonly logger = new Logger(SyncCronService.name);

    constructor(
        private readonly syncEmpleadosService: SyncEmpleadosService,
    ) { }

    @Cron('0 6 * * *', {
        name: 'sync-nomina',
        timeZone: 'America/Argentina/Buenos_Aires'
    })
    async handleSyncNomina() {
        this.logger.log('-'.repeat(25));
        this.logger.log('Starting scheduled Nomina sync');
        this.logger.log('-'.repeat(25));

        try {
            await this.syncEmpleadosService.syncEmpleadoWithNomina();

            this.logger.log('Sync completed');
        } catch (error) {
            this.logger.error('Error in Sync:');
            this.logger.error(error.message);
            this.logger.error(error.stack);

            throw error;
        } finally {
            this.logger.log('-'.repeat(25));
        };
    };
};
