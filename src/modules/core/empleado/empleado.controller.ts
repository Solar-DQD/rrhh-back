import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetEmpleadosDto } from './dto/get-empleado.dto';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { EditEmpleadoBodyDto } from './dto/edit-empleado.dto';
import { GetObservacionesByEmpleadoBodyDto } from '../observacion/dto/get-observacion-empleado.dto';
import { ObservacionService } from '../observacion/observacion.service';
import { JornadaService } from '../jornada/jornada.service';
import { GetJornadasByEmpleadoQueryDto } from '../jornada/dto/get-jornada-empleado.dto';
import { GetResumenByEmpleadoQueryDto } from '../jornada/dto/get-resumen-empleado.dto';

@Controller('empleado')
@UseGuards(JwtAuthGuard)
export class EmpleadoController {
  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly observacionService: ObservacionService,
    private readonly jornadaService: JornadaService
  ) {}

  @Get()
  async getEmpleados(@Query() query: GetEmpleadosDto) {
    return this.empleadoService.getEmpleados(query);
  };

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEmpleado(@Body() body: CreateEmpleadoDto) {
    await this.empleadoService.createEmpleado(body);
    return { message: 'Empleado created' };
  };

  @Patch(':id')
  async editEmpleado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EditEmpleadoBodyDto
  ) {
    await this.empleadoService.editEmpleado({ id, ...body });
    return { message: 'Empleado edited' };
  };

  @Delete(':id')
  async deactivateEmpleado(
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.empleadoService.deactivateEmpleado({ id });
    return { message: 'Empleado deactivated' }
  };

  @Get(':id/observacion')
  async getObservacionesByEmpleado(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetObservacionesByEmpleadoBodyDto
  ) {
    return this.observacionService.getObservacionesByEmpleado({ id_empleado: id, ...query });
  };

  @Get(':id/jornada')
  async getJornadasByEmpleado(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetJornadasByEmpleadoQueryDto
  ) {
    return this.jornadaService.getJornadasByEmpleado({ id_empleado: id, ...query});
  };

  @Get(':id/resumen')
  async getResumenByEmpleado(
    @Param('id', ParseIntPipe) id: number,
    @Query() query : GetResumenByEmpleadoQueryDto
  ) {
    return this.jornadaService.getResumenByEmpleado({ id_empleado: id, ...query });
  };
};
