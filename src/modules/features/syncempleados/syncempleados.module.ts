import { Module } from '@nestjs/common';
import { SyncEmpleadosService } from './syncempleados.service';
import { SyncEmpleadosController } from './syncempleados.controller';
import { NominaModule } from 'src/modules/mssql/nomina/nomina.module';
import { EmpleadoModule } from 'src/modules/core/empleado/empleado.module';
import { TipoEmpleadoModule } from 'src/modules/core/tipoempleado/tipoempleado.module';
import { EstadoEmpleadoModule } from 'src/modules/core/estadoempleado/estadoempleado.module';
import { ProyectoModule } from 'src/modules/core/proyecto/proyecto.module';
import { ModalidadValidacionModule } from 'src/modules/core/modalidadvalidacion/modalidadvalidacion.module';

@Module({
  imports: [
    NominaModule,
    EmpleadoModule,
    TipoEmpleadoModule,
    EstadoEmpleadoModule,
    ProyectoModule,
    ModalidadValidacionModule
  ],
  controllers: [SyncEmpleadosController],
  providers: [SyncEmpleadosService],
  exports: [SyncEmpleadosService]
})
export class SyncEmpleadosModule {}
