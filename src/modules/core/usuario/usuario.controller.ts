import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { GetUsuarioByEmailDto } from './dto/get-usuario-correo.dto';
import { GetUsuariosDto } from './dto/get-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { EditUsuarioBodyDto } from './dto/edit-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('/login')
  async getUsuarioByEmail(@Query() query: GetUsuarioByEmailDto) {
    return this.usuarioService.getUsuarioByEmail(query);
  };

  @Get()
  async getUsuarios(@Query() query: GetUsuariosDto) {
    return this.usuarioService.getUsuarios(query);
  };

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUsuario(@Body() body: CreateUsuarioDto) {
    await this.usuarioService.createUsuario(body);
    return { message: 'Usuario created' };
  };

  @Patch(':id')
  async editUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EditUsuarioBodyDto,
  ) {
    await this.usuarioService.editUsuario({ id, ...body });
    return { message: 'Usuario edited' };
  };

  @Delete(':id')
  async deactivateUsuario(@Param('id', ParseIntPipe) id: number) {
    await this.usuarioService.deactivateUsuario({ id });
    return { message: 'Usuario deactivated' };
  };
};
