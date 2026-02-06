import { Controller, Get, UseGuards } from '@nestjs/common';
import { TipoImportacionService } from './tipoimportacion.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('tipoimportacion')
@UseGuards(JwtAuthGuard)
export class TipoImportacionController {
  constructor(private readonly tipoImportacionService: TipoImportacionService) {}

  @Get()
  async getTiposImportacion() {
    return await this.tipoImportacionService.getTiposImportacion();
  };
};
