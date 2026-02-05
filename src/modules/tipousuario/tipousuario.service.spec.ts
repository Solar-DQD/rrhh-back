import { Test, TestingModule } from '@nestjs/testing';
import { TipousuarioService } from './tipousuario.service';

describe('TipousuarioService', () => {
  let service: TipousuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipousuarioService],
    }).compile();

    service = module.get<TipousuarioService>(TipousuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
