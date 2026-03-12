import { Controller, Get, UseGuards } from '@nestjs/common';
import { ModalidadValidacionService } from './modalidadvalidacion.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('modalidadvalidacion')
@UseGuards(JwtAuthGuard)
export class ModalidadValidacionController {
  constructor(private readonly modalidadValidacionService: ModalidadValidacionService) {}

  @Get()
  async getModalidadesValidacion() {
    return this.modalidadValidacionService.getModalidadesValidacion();
  };
};
