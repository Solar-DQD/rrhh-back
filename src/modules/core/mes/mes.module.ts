import { Module } from '@nestjs/common';
import { MesService } from './mes.service';
import { MesController } from './mes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mes } from './entities/mes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mes])
  ],
  controllers: [MesController],
  providers: [MesService],
  exports: [MesService]
})
export class MesModule {}
