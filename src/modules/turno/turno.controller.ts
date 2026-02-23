import { Controller, Get, UseGuards } from '@nestjs/common';
import { TurnoService } from './turno.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('turno')
@UseGuards(JwtAuthGuard)
export class TurnoController {
  constructor(private readonly turnoService: TurnoService) {}

  @Get()
  async getTurnos() {
    return this.turnoService.getTurnos();
  };
};
