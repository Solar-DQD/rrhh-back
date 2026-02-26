import { Module } from '@nestjs/common';
import { ModalidadValidacionService } from './modalidadvalidacion.service';
import { ModalidadValidacionController } from './modalidadvalidacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModalidadValidacion } from './entities/modalidadvalidacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModalidadValidacion])
  ],
  controllers: [ModalidadValidacionController],
  providers: [ModalidadValidacionService],
  exports: [ModalidadValidacionService],
})
export class ModalidadValidacionModule {}
