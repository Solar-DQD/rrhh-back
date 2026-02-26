import { Module } from '@nestjs/common';
import { ModalidadTrabajoService } from './modalidadtrabajo.service';
import { ModalidadTrabajoController } from './modalidadtrabajo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModalidadTrabajo } from './entities/modalidadtrabajo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModalidadTrabajo])
  ],
  controllers: [ModalidadTrabajoController],
  providers: [ModalidadTrabajoService],
  exports: [ModalidadTrabajoService]
})
export class ModalidadTrabajoModule {}
