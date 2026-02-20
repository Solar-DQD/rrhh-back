import { Module } from '@nestjs/common';
import { EstadoJornadaService } from './estadojornada.service';
import { EstadoJornada } from './entities/estadojornada.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadoJornada])
  ],
  providers: [EstadoJornadaService],
  exports: [EstadoJornadaService]
})
export class EstadoJornadaModule {}
