import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetAsistenciaProyectoDto } from './dto/get-asistencia-proyecto.dto';

@Controller('asistencia')
@UseGuards(JwtAuthGuard)
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) { }

  @Get()
  async getAsistencia(@Query() query: GetAsistenciaProyectoDto) {
    return this.asistenciaService.getAsistenciaProyecto(query);
  };
};
