import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { TipoAusenciaService } from './tipoausencia.service';
import { GetTiposAusenciaPaginatedDto } from './dto/get-tiposausencia-paginated.dto';
import { CreateTipoAusenciaDto, EditTipoAusenciaBodyDto } from './dto/create-tipoausencia.dto';

@Controller('tipoausencia')
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
  async createTipoAusencia(@Body() dto: CreateTipoAusenciaDto) {
    await this.tipoAusenciaService.createTipoAusencia(dto);
    return { message: 'TipoAusencia created' }
  };

  @Patch(':id')
  async editTipoAusencia(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EditTipoAusenciaBodyDto,
  ) {
    await this.tipoAusenciaService.editTipoAusencia({ id, ...body });
    return { message: 'TipoAusencia edited' }
  };

  @Delete(':id')
  async deactivateTipoAusencia(
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.tipoAusenciaService.deactivateTipoAusencia({ id });
    return { message: 'TipoAusencia deactivated' }
  };
};
