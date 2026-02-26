import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetEmpleadosDto } from './dto/get-empleado.dto';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { EditEmpleadoBodyDto } from './dto/edit-empleado.dto';
import { GetObservacionesByEmpleadoBodyDto } from '../observacion/dto/get-observacion-empleado.dto';
import { ObservacionService } from '../observacion/observacion.service';

@Controller('empleado')
@UseGuards(JwtAuthGuard)
export class EmpleadoController {
  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly observacionService: ObservacionService
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

  @Patch(':id')
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

  //PENDING
  //endpoint de jornadas
};
