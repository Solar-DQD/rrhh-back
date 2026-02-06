import { Controller, Get, UseGuards } from '@nestjs/common';
import { TipoEmpleadoService } from './tipoempleado.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('tipoempleado')
@UseGuards(JwtAuthGuard)
export class TipoEmpleadoController {
  constructor(private readonly tipoEmpleadoService: TipoEmpleadoService) {}

  @Get()
  async getTiposEmpleado() {
    return await this.tipoEmpleadoService.getTiposEmpleado();
  };
};
