import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetProyectosPaginatedDto } from './dto/get-proyecto-paginated.dto';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { EditProyectoBodyDto } from './dto/edit-proyecto.dto';

@Controller('proyecto')
@UseGuards(JwtAuthGuard)
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) { }

  @Get()
  async getProyectos() {
    return await this.proyectoService.getProyectos();
  };

  @Get('paginated')
  async getProyectosPaginated(@Query() query: GetProyectosPaginatedDto) {
    return this.proyectoService.getProyectosPaginated(query);
  };

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProyecto(@Body() body: CreateProyectoDto) {
    await this.proyectoService.createProyecto(body);
    return { message: 'Proyecto created' }
  };

  @Patch(':id')
  async editProyecto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EditProyectoBodyDto
  ) {
    await this.proyectoService.editProyecto({ id, ...body });
    return { messaage: 'Proyecto edited' };
  };

  @Delete(':id')
  async deactivateProyecto(
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.proyectoService.deactivateProyecto({ id });
    return { message: 'Proyecto deactivated' };
  };
};
