import { Module } from '@nestjs/common';
import { FuenteMarcaService } from './fuentemarca.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuenteMarca } from './entities/fuentemarca.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuenteMarca])
  ],
  providers: [FuenteMarcaService],
  exports: [FuenteMarcaService]
})
export class FuenteMarcaModule {}
