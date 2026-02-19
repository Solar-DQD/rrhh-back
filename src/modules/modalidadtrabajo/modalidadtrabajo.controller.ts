import { Controller, Get, UseGuards } from '@nestjs/common';
import { ModalidadTrabajoService } from './modalidadtrabajo.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('modalidadtrabajo')
@UseGuards(JwtAuthGuard)
export class ModalidadTrabajoController {
  constructor(private readonly modalidadTrabajoService: ModalidadTrabajoService) {}

  @Get()
  async getModalidadesTrabajo() {
    return await this.modalidadTrabajoService.getModalidadesTrabajo();
  };
};
