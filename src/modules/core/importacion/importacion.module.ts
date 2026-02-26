import { Module } from '@nestjs/common';
import { ImportacionService } from './importacion.service';
import { ImportacionController } from './importacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Importacion } from './entities/importacion.entity';
import { EstadoImportacionModule } from '../estadoimportacion/estadoimportacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Importacion]),
    EstadoImportacionModule
  ],
  controllers: [ImportacionController],
  providers: [ImportacionService],
  exports: [ImportacionService]
})
export class ImportacionModule {}
