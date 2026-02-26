import { Module } from '@nestjs/common';
import { TipoUsuarioService } from './tipousuario.service';
import { TipoUsuarioController } from './tipousuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoUsuario } from './entities/tipousuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoUsuario])
  ],
  controllers: [TipoUsuarioController],
  providers: [TipoUsuarioService],
  exports: [TipoUsuarioService],
})
export class TipoUsuarioModule {}
