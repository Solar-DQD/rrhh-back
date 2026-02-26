import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { SyncEmpleadosService } from './syncempleados.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncEmpleadosController {
  constructor(private readonly syncEmpleadosService: SyncEmpleadosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async syncEmpleadoWithNomina() {
    await this.syncEmpleadosService.syncEmpleadoWithNomina();
    return { message: 'Tables synced'}
  };
};
