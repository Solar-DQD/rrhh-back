import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JornadaService } from './jornada.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateObservacionBodyDto } from '../observacion/dto/create-observacion.dto';
import { ObservacionService } from '../observacion/observacion.service';
import { EditJornadaBodyDto } from './dto/edit-jornada.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { EditAusenciaBodyDto } from '../ausencia/dto/edit-ausencia.dto';
import { CreateJornadaManualBodyDto } from './dto/create-jornada-manual.dto';

@Controller('jornada')
@UseGuards(JwtAuthGuard)
export class JornadaController {
  constructor(
    private readonly jornadaService: JornadaService,
    private readonly observacionService: ObservacionService
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createJornadaManual(
    @Body() body: CreateJornadaManualBodyDto,
    @GetUser('id') id_usuario: string
  ) {
    await this.jornadaService.createJornadaManual({ ...body, id_usuariocreacion: Number(id_usuario) });
    return { message: 'Jornada created' };
  };

  @Post(':id/observacion')
  @HttpCode(HttpStatus.CREATED)
  async createObservacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateObservacionBodyDto
  ) {
    await this.observacionService.createObservacion({ id_jornada: id, ...body });
    return { message: 'Observacion created' };
  };

  @Delete(':id')
  async deleteJornada(
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.jornadaService.deleteJornada({ id });
    return { message: 'Jornada deleted' };
  };

  @Patch(':id/editar')
  async editJornada(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EditJornadaBodyDto,
    @GetUser('id') id_usuario: string
  ) {
    await this.jornadaService.editJornada({ id, ...body, id_usuariomodificacion: Number(id_usuario) });
    return { message: 'Jornada edited' };
  };

  @Patch(':id/validar')
  async setEstadoJornadaValida(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') id_usuario: string
  ) {
    await this.jornadaService.setEstadoJornadaValida({ id, id_usuariovalidacion: Number(id_usuario) });
    return { message: 'Jornada validated' };
  };

  @Patch(':id/justificar')
  async setTipoAusenciaJornadaAusencia(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EditAusenciaBodyDto
  ) {
    await this.jornadaService.setTipoAusenciaJornadaAusencia({ id, ...body });
    return { message: 'Absence justified' };
  };
};
