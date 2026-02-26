import { Module } from '@nestjs/common';
import { EstadoParametroService } from './estadoparametro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoParametro } from './entities/estadoparametro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadoParametro])
  ],
  providers: [EstadoParametroService],
  exports: [EstadoParametroService]
})
export class EstadoParametroModule {}
