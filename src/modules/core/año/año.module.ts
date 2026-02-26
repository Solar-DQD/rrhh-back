import { Module } from '@nestjs/common';
import { AñoService } from './año.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Año } from './entities/año.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Año])
  ],
  providers: [AñoService],
  exports: [AñoService]
})
export class AñoModule {}
