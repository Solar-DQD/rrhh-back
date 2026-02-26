import { Controller, Get } from '@nestjs/common';
import { MesService } from './mes.service';

@Controller('mes')
export class MesController {
  constructor(private readonly mesService: MesService) {}

  @Get()
  async getMeses() {
    return await this.mesService.getMeses();
  };
};
