import { Module } from '@nestjs/common';
import { TipoAusenciaService } from './tipoausencia.service';
import { TipoAusenciaController } from './tipoausencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoAusencia } from './entities/tipoausencia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoAusencia])
  ],
  controllers: [TipoAusenciaController],
  providers: [TipoAusenciaService],
  exports: [TipoAusenciaService]
})
export class TipoAusenciaModule {}
