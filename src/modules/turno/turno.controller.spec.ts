import { Test, TestingModule } from '@nestjs/testing';
import { TurnoController } from './turno.controller';
import { TurnoService } from './turno.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

describe('TurnoController', () => {
  let controller: TurnoController;
  let service: TurnoService;

  const mockTurnoService = {
    getTurnos: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurnoController],
      providers: [
        {
          provide: TurnoService,
          useValue: mockTurnoService,
        }
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true})
      .compile();

    controller = module.get<TurnoController>(TurnoController);
    service = module.get<TurnoService>(TurnoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return turnos from the service', async () => {
    const result = [
      { id: 1, nombre: 'Diurno' },
      { id: 2, nombre: 'Nocturno' },
    ];

    jest.spyOn(service, 'getTurnos').mockResolvedValue(result);

    const response = await controller.getTurnos();

    expect(service.getTurnos).toHaveBeenCalled();
    expect(response).toEqual(result);
  });
});
