import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TipoUsuarioService } from './tipousuario.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('tipousuario')
@UseGuards(JwtAuthGuard)
export class TipoUsuarioController {
  constructor(private readonly tipoUsuarioService: TipoUsuarioService) {}

  @Get()
  async getTiposUsuario() {
    return this.tipoUsuarioService.getTiposUsuario();
  };

  @Public()
  @Get(':id')
  async getTipoUsuarioPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tipoUsuarioService.getTipoUsuarioPorId({ id });
  }; 
};
