import { Test, TestingModule } from '@nestjs/testing';
import { TipousuarioController } from './tipousuario.controller';
import { TipousuarioService } from './tipousuario.service';

describe('TipousuarioController', () => {
  let controller: TipousuarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipousuarioController],
      providers: [TipousuarioService],
    }).compile();

    controller = module.get<TipousuarioController>(TipousuarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
