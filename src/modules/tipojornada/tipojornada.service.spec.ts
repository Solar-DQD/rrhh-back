import { Test, TestingModule } from '@nestjs/testing';
import { TipojornadaService } from './tipojornada.service';

describe('TipojornadaService', () => {
  let service: TipojornadaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipojornadaService],
    }).compile();

    service = module.get<TipojornadaService>(TipojornadaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
