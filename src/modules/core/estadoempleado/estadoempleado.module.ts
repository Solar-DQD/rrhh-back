import { Module } from '@nestjs/common';
import { EstadoEmpleadoService } from './estadoempleado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoEmpleado } from './entities/estadoempleado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadoEmpleado])
  ],
  providers: [EstadoEmpleadoService],
  exports: [EstadoEmpleadoService]
})
export class EstadoEmpleadoModule {}
