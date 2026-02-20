import { Module } from '@nestjs/common';
import { EstadoUsuarioService } from './estadousuario.service';
import { EstadoUsuario } from './entities/estadousuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadoUsuario])
  ],
  providers: [EstadoUsuarioService],
  exports: [EstadoUsuarioService]
})
export class EstadoUsuarioModule {}
