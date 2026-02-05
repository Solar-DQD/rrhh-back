import { Test, TestingModule } from '@nestjs/testing';
import { TurnoService } from './turno.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

describe('TurnoService', () => {
  let service: TurnoService;
  let repo: jest.Mocked<Repository<Turno>>;

  const mockTurnoRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnoService,
        {
          provide: getRepositoryToken(Turno),
          useValue: mockTurnoRepository,
        },
      ],
    }).compile();

    service = module.get<TurnoService>(TurnoService);
    repo = module.get(getRepositoryToken(Turno));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------
  // getTurnos
  // -------------------------

  it('should return all turnos', async () => {
    const turnos = [
      { id: 1, nombre: 'Mañana' },
      { id: 2, nombre: 'Tarde' },
    ] as Turno[];

    repo.find.mockResolvedValue(turnos);

    const result = await service.getTurnos();

    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual(turnos);
  });

  it('should throw if find fails', async () => {
    repo.find.mockRejectedValue(new Error('db error'));

    await expect(service.getTurnos())
      .rejects
      .toThrow(InternalServerErrorException);
  });

  // -------------------------
  // getTurnoNocturno — exists
  // -------------------------

  it('should return id if nocturno exists', async () => {
    const turno = { id: 5, nombre: 'Nocturno' } as Turno;

    repo.findOne.mockResolvedValue(turno);

    const id = await service.getTurnoNocturno();

    expect(repo.findOne).toHaveBeenCalledWith({
      where: { nombre: 'Nocturno' },
    });

    expect(repo.save).not.toHaveBeenCalled();
    expect(id).toBe(5);
  });

  // -------------------------
  // getTurnoNocturno — create if missing
  // -------------------------

  it('should create nocturno if missing', async () => {
    const created = { nombre: 'Nocturno' } as Turno;
    const saved = { id: 9, nombre: 'Nocturno' } as Turno;

    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(saved);

    const id = await service.getTurnoNocturno();

    expect(repo.create).toHaveBeenCalledWith({
      nombre: 'Nocturno',
    });

    expect(repo.save).toHaveBeenCalledWith(created);
    expect(id).toBe(9);
  });

  // -------------------------
  // error path
  // -------------------------

  it('should throw if getTurnoNocturno fails', async () => {
    repo.findOne.mockRejectedValue(new Error());

    await expect(service.getTurnoNocturno())
      .rejects
      .toThrow(InternalServerErrorException);
  });
});
