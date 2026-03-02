import { Module } from '@nestjs/common';
import { ObservacionService } from './observacion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observacion } from './entities/observacion.entity';
import { ObservacionController } from './observacion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Observacion])
  ],
  controllers: [ObservacionController],
  providers: [ObservacionService],
  exports: [ObservacionService]
})
export class ObservacionModule {}
