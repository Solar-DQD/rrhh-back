import { Module } from '@nestjs/common';
import { QuincenaService } from './quincena.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quincena } from './entities/quincena.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quincena])
  ],
  providers: [QuincenaService],
  exports: [QuincenaService]
})
export class QuincenaModule {}
