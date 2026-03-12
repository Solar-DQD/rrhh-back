import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ControlService } from './control.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetControlesPaginatedDto } from './dto/get-control-paginated.dto';
import { CreateControlDto } from './dto/create-control.dto';
import { EditControlBodyDto } from './dto/edit-control.dto';

@Controller('control')
@UseGuards(JwtAuthGuard)
export class ControlController {
  constructor(private readonly controlService: ControlService) { }

  @Get()
  async getControles(@Query() query: GetControlesPaginatedDto) {
    return this.controlService.getControlesPaginated(query);
  };

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createControl(@Body() body: CreateControlDto) {
    await this.createControl(body);
    return { message: 'Control created' };
  };

  @Patch(':id')
  async editControl(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EditControlBodyDto,
  ) {
    await this.controlService.editControl({ id, ...body });
    return { message: 'Control edited' };
  };

  @Delete(':id')
  async DeleteControlDto(
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.controlService.deleteControl({ id });
    return { message: 'Control deleted '};
  };
};
