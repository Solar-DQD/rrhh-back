import { Module } from '@nestjs/common';
import { AusenciaService } from './entities/ausencia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ausencia } from './entities/ausencia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ausencia])
  ],
  providers: [AusenciaService],
  exports: [AusenciaService]
})
export class AusenciaModule {}
