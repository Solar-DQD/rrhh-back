import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TipoUsuarioService } from './tipousuario.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller(['tipousuario', 'tiposusuario'])
//@UseGuards(JwtAuthGuard)
export class TipoUsuarioController {
  constructor(private readonly tipoUsuarioService: TipoUsuarioService) {}

  @Get()
  async getTiposUsuario() {
    return await this.tipoUsuarioService.getTiposUsuario();
  };

  @Get(':id')
  async getTipoUsuarioPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.tipoUsuarioService.getTipoUsuarioPorId({ id });
  }; 
};
