import { Controller, Get, Query, Res } from '@nestjs/common';
import { ExportarService } from './exportar.service';
import express from 'express'
import { ExportAsistenciaDto } from './dto/export-asistencia.dto';
import { ExportResumenDto } from './dto/export-resumen.dto';

@Controller('exportar')
export class ExportarController {
  constructor(private readonly exportarService: ExportarService) { }

  @Get('asistencia')
  async exportAsistencia(
    @Query() query: ExportAsistenciaDto,
    @Res() response: express.Response
  ) {
    const reporte = await this.exportarService.exportAsistencia(query);

    response.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${reporte.nombre}"`,
      'Content-Length': reporte.reporte.byteLength.toString()
    });

    response.end(reporte.reporte)
  };

  @Get('resumen')
  async ExportResumen(
    @Query() query: ExportResumenDto,
    @Res() response: express.Response
  ) {
    const reporte = await this.exportarService.exportResumen(query);

    response.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${reporte.nombre}"`,
      'Content-Length': reporte.reporte.byteLength.toString()
    });

    response.end(reporte.reporte)
  };
};
