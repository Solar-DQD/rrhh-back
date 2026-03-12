import { Module } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaController } from './asistencia.controller';
import { NominaModule } from 'src/modules/mssql/nomina/nomina.module';
import { RegistrosAccesoModule } from 'src/modules/mssql/registros_acceso/registros_acceso.module';
import { EmpleadoModule } from 'src/modules/core/empleado/empleado.module';
import { ControlModule } from 'src/modules/core/control/control.module';
import { ProyectoModule } from 'src/modules/core/proyecto/proyecto.module';
import { TipoEmpleadoModule } from 'src/modules/core/tipoempleado/tipoempleado.module';

@Module({
  imports: [
    NominaModule,
    RegistrosAccesoModule,
    ProyectoModule,
    ControlModule,
    EmpleadoModule,
    TipoEmpleadoModule
  ],
  controllers: [AsistenciaController],
  providers: [AsistenciaService],
  exports: [AsistenciaService]
})
export class AsistenciaModule {}
