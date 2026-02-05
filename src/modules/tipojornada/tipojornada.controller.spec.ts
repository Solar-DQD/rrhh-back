import { Test, TestingModule } from '@nestjs/testing';
import { TipojornadaController } from './tipojornada.controller';
import { TipojornadaService } from './tipojornada.service';

describe('TipojornadaController', () => {
  let controller: TipojornadaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipojornadaController],
      providers: [TipojornadaService],
    }).compile();

    controller = module.get<TipojornadaController>(TipojornadaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
