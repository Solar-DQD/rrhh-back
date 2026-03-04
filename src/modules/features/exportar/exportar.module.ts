import { Module } from '@nestjs/common';
import { ExportarService } from './exportar.service';
import { ExportarController } from './exportar.controller';
import { AsistenciaModule } from '../asistencia/asistencia.module';
import { ExcelModule } from '../excel/excel.module';
import { ProyectoModule } from 'src/modules/core/proyecto/proyecto.module';
import { TipoEmpleadoModule } from 'src/modules/core/tipoempleado/tipoempleado.module';
import { MesModule } from 'src/modules/core/mes/mes.module';

@Module({
  imports: [
    AsistenciaModule,
    ExcelModule,
    ProyectoModule,
    MesModule,
    TipoEmpleadoModule
  ],
  controllers: [ExportarController],
  providers: [ExportarService],
  exports: [ExportarService]
})
export class ExportarModule {}
