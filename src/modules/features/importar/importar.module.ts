import { Module } from '@nestjs/common';
import { ImportarService } from './importar.service';
import { ImportarController } from './importar.controller';
import { ControlModule } from 'src/modules/core/control/control.module';
import { RegistrosAccesoModule } from 'src/modules/mssql/registros_acceso/registros_acceso.module';
import { ProyectoModule } from 'src/modules/core/proyecto/proyecto.module';
import { EmpleadoModule } from 'src/modules/core/empleado/empleado.module';
import { ModalidadTrabajoModule } from 'src/modules/core/modalidadtrabajo/modalidadtrabajo.module';
import { EstadoImportacionModule } from 'src/modules/core/estadoimportacion/estadoimportacion.module';
import { TipoImportacionModule } from 'src/modules/core/tipoimportacion/tipoimportacion.module';
import { ImportacionModule } from 'src/modules/core/importacion/importacion.module';
import { EstadoJornadaModule } from 'src/modules/core/estadojornada/estadojornada.module';
import { FuenteMarcaModule } from 'src/modules/core/fuentemarca/fuentemarca.module';
import { AñoModule } from 'src/modules/core/año/año.module';
import { MesModule } from 'src/modules/core/mes/mes.module';
import { QuincenaModule } from 'src/modules/core/quincena/quincena.module';
import { JornadaModule } from 'src/modules/core/jornada/jornada.module';
import { AusenciaModule } from 'src/modules/core/ausencia/ausencia.module';
import { TipoJornadaModule } from 'src/modules/core/tipojornada/tipojornada.module';
import { TipoAusenciaModule } from 'src/modules/core/tipoausencia/tipoausencia.module';
import { AsistenciaModule } from '../asistencia/asistencia.module';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [
    ControlModule,
    RegistrosAccesoModule,
    ProyectoModule,
    EmpleadoModule,
    ModalidadTrabajoModule,
    EstadoImportacionModule,
    TipoImportacionModule,
    ImportacionModule,
    EstadoJornadaModule,
    FuenteMarcaModule,
    AñoModule,
    MesModule,
    QuincenaModule,
    JornadaModule,
    AusenciaModule,
    AsistenciaModule,
    TipoJornadaModule,
    TipoAusenciaModule,
    ExcelModule
  ],
  controllers: [ImportarController],
  providers: [ImportarService],
  exports: [ImportarService]
})
export class ImportarModule {}
