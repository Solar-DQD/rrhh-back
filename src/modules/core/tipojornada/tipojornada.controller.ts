import { Controller, Get, UseGuards } from '@nestjs/common';
import { TipoJornadaService } from './tipojornada.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('tipojornada')
@UseGuards(JwtAuthGuard)
export class TipoJornadaController {
  constructor(private readonly tipoJornadaService: TipoJornadaService) {}

  @Get()
  async getTiposJornada() {
    return this.tipoJornadaService.getTiposJornada();
  };
};
