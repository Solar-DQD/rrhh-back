import { Module } from '@nestjs/common';
import { TipoJornadaService } from './tipojornada.service';
import { TipoJornadaController } from './tipojornada.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoJornada } from './entities/tipojornada.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoJornada])
  ],
  controllers: [TipoJornadaController],
  providers: [TipoJornadaService],
  exports: [TipoJornadaService],
})
export class TipoJornadaModule { }
