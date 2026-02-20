import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TipoAusenciaService } from './tipoausencia.service';
import { GetTiposAusenciaPaginatedDto } from './dto/get-tiposausencia-paginated.dto';
import { CreateTipoAusenciaDto } from './dto/create-tipoausencia.dto';
import { EditTipoAusenciaBodyDto } from './dto/edit-tipoausencia.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('tipoausencia')
@UseGuards(JwtAuthGuard)
export class TipoAusenciaController {
  constructor(private readonly tipoAusenciaService: TipoAusenciaService) { }

  @Get()
  async getTiposAusencia() {
    return await this.tipoAusenciaService.getTiposAusencia();
  };

  @Get('paginated')
  async getTiposAusenciaPaginated(@Query() query: GetTiposAusenciaPaginatedDto) {
    return this.tipoAusenciaService.getTiposAusenciaPaginated(query);
  };

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTipoAusencia(@Body() body: CreateTipoAusenciaDto) {
    await this.tipoAusenciaService.createTipoAusencia(body);
    return { message: 'TipoAusencia created' };
  };

  @Patch(':id')
  async editTipoAusencia(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EditTipoAusenciaBodyDto,
  ) {
    await this.tipoAusenciaService.editTipoAusencia({ id, ...body });
    return { message: 'TipoAusencia edited' };
  };

  @Delete(':id')
  async deactivateTipoAusencia(
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.tipoAusenciaService.deactivateTipoAusencia({ id });
    return { message: 'TipoAusencia deactivated' };
  };
};
