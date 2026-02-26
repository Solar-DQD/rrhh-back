import { Module } from '@nestjs/common';
import { TipoImportacionService } from './tipoimportacion.service';
import { TipoImportacionController } from './tipoimportacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoImportacion } from './entities/tipoimportacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoImportacion])
  ],
  controllers: [TipoImportacionController],
  providers: [TipoImportacionService],
  exports: [TipoImportacionService]
})
export class TipoImportacionModule {}
