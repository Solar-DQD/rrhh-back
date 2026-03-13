import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ImportCronService } from './importcron.service';

@Controller('cron')
export class CronController {
  constructor(
    private readonly importCronService: ImportCronService,
  ) {}
 
  @Post('import')
  @HttpCode(HttpStatus.OK)
  async manualAutoImport() {
    const results = await this.importCronService.manualImport();
    return {
      message: 'Manual Import completed',
      results,
    };
  };
};