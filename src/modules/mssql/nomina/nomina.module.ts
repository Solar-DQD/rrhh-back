import { Module } from '@nestjs/common';
import { NominaService } from './nomina.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nomina } from './entities/nomina.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nomina], 'mssql')
  ],
  providers: [NominaService],
  exports: [NominaService]
})
export class NominaModule {}
