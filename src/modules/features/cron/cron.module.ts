import { Module } from '@nestjs/common';
import { SyncCronService } from './synccron.service';
import { ImportarModule } from '../importar/importar.module';
import { SyncEmpleadosModule } from '../syncempleados/syncempleados.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FeriadosUtil } from './feriados.util';
import { CronController } from './cron.controller';
import { ImportCronService } from './importcron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SyncEmpleadosModule,
    ImportarModule,
  ],
  controllers: [CronController],
  providers: [
    SyncCronService,
    ImportCronService,
    FeriadosUtil
  ],
})
export class CronModule { }
