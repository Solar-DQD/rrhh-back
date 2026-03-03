import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImportarService } from './importar.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ImportJornadasHikVisionBodyDto } from './dto/import-jornadas-hikvision.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportJornadasProSoftBodyDto } from './dto/import-jornadas-prosoft.dto';

@Controller('importar')
@UseGuards(JwtAuthGuard)
export class ImportarController {
  constructor(private readonly importarService: ImportarService) { }

  @Post('hikvision')
  @HttpCode(HttpStatus.CREATED)
  async importHickViscionAccesos(
    @Body() body: ImportJornadasHikVisionBodyDto,
    @GetUser('id') id_usuario: string
  ) {
    return this.importarService.importJornadasHikVision({ ...body, id_usuariocreacion: Number(id_usuario) });
  };

  @Post('prosoft')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async importProSoft(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportJornadasProSoftBodyDto,
    @GetUser('id') id_usuario: string
  ) {
    return this.importarService.importJornadasProSoft({
      ...body,
      file,
      id_usuariocreacion: Number(id_usuario)
    });
  };
};
