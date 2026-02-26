import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { EstadoParametroModule } from '../estadoparametro/estadoparametro.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proyecto]),
    EstadoParametroModule
  ],
  controllers: [ProyectoController],
  providers: [ProyectoService],
  exports: [ProyectoService]
})
export class ProyectoModule {}
