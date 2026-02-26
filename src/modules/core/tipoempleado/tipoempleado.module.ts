import { Module } from '@nestjs/common';
import { TipoEmpleadoService } from './tipoempleado.service';
import { TipoEmpleadoController } from './tipoempleado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoEmpleado } from './entities/tipoempleado.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoEmpleado])
  ],
  controllers: [TipoEmpleadoController],
  providers: [TipoEmpleadoService],
  exports: [TipoEmpleadoService]
})
export class TipoEmpleadoModule {}
