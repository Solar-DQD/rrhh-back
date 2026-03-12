import { Module } from '@nestjs/common';
import { EstadoImportacionService } from './estadoimportacion.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoImportacion } from './entities/estadoimportacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadoImportacion])
  ],
  providers: [EstadoImportacionService],
  exports: [EstadoImportacionService]
})
export class EstadoImportacionModule {}
