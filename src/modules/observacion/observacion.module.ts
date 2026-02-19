import { Module } from '@nestjs/common';
import { ObservacionService } from './observacion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observacion } from './entities/observacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Observacion])
  ],
  providers: [ObservacionService],
  exports: [ObservacionService]
})
export class ObservacionModule {}
