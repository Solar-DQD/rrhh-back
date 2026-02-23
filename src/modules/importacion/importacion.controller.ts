import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { ImportacionService } from './importacion.service';
import { GetImportacionesDto } from './dto/get-importacion.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('importacion')
@UseGuards(JwtAuthGuard)
export class ImportacionController {
  constructor(private readonly importacionService: ImportacionService) {}

  @Get()
  async getImportaciones(@Query() query: GetImportacionesDto) {
    return this.importacionService.getImportaciones(query);
  };

  @Patch(':id')
  async setImportacionEstadoCompleta(@Param('id', ParseIntPipe) id: number) {
    await this.importacionService.setEstadoImportacionCompleta({ id });
    return { message: 'Importacion edited' };
  };

  @Delete(':id')
  async deleteImportacion(@Param('id', ParseIntPipe) id: number) {
    await this.importacionService.deleteImportacion({ id });
    return { message: 'Importacion deleted' };
  };

  @Get(':id/jornada')
  async getImportacionJornadas() {
    //PENDING
  }
};
