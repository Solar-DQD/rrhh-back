import { forwardRef, Module } from '@nestjs/common';
import { JornadaService } from './jornada.service';
import { JornadaController } from './jornada.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jornada } from './entities/jornada.entity';
import { TipoAusenciaModule } from '../tipoausencia/tipoausencia.module';
import { TipoJornadaModule } from '../tipojornada/tipojornada.module';
import { EstadoJornadaModule } from '../estadojornada/estadojornada.module';
import { FuenteMarcaModule } from '../fuentemarca/fuentemarca.module';
import { AñoModule } from '../año/año.module';
import { MesModule } from '../mes/mes.module';
import { QuincenaModule } from '../quincena/quincena.module';
import { EmpleadoModule } from '../empleado/empleado.module';
import { AusenciaModule } from '../ausencia/ausencia.module';
import { ObservacionModule } from '../observacion/observacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jornada]),
    TipoAusenciaModule,
    TipoJornadaModule,
    EstadoJornadaModule,
    FuenteMarcaModule,
    AñoModule,
    MesModule,
    QuincenaModule,
    forwardRef(() => EmpleadoModule),
    AusenciaModule,
    ObservacionModule
  ],
  controllers: [JornadaController],
  providers: [JornadaService],
  exports: [JornadaService]
})
export class JornadaModule {}
