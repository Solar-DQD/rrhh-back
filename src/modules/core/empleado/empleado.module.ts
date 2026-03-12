import { forwardRef, Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { TipoEmpleadoModule } from '../tipoempleado/tipoempleado.module';
import { ModalidadValidacionModule } from '../modalidadvalidacion/modalidadvalidacion.module';
import { EstadoEmpleadoModule } from '../estadoempleado/estadoempleado.module';
import { ObservacionModule } from '../observacion/observacion.module';
import { JornadaModule } from '../jornada/jornada.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empleado]),
    TipoEmpleadoModule,
    ModalidadValidacionModule,
    EstadoEmpleadoModule,
    ObservacionModule,
    forwardRef(() => JornadaModule)
  ],
  controllers: [EmpleadoController],
  providers: [EmpleadoService],
  exports: [EmpleadoService]
})
export class EmpleadoModule {}
