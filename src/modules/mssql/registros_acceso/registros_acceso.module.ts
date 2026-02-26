import { Module } from '@nestjs/common';
import { RegistrosAccesoService } from './registros_acceso.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroAcceso } from './entities/registros_acceso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegistroAcceso], 'mssql')
  ],
  providers: [RegistrosAccesoService],
  exports: [RegistrosAccesoService]
})
export class RegistrosAccesoModule {}
