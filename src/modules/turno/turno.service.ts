import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './entities/turno.entity';

@Injectable()
export class TurnoService {
    private idCache: Map<string, number> = new Map();
    private cache: Turno[] | null = null;

    constructor(
        @InjectRepository(Turno)
        private turnoRepository: Repository<Turno>
    ) { }

    //Get all
    async getTurnos(): Promise<Turno[]> {
        if (this.cache) return this.cache;

        this.cache = await this.turnoRepository.find();

        this.cache.forEach(turno => {
            this.idCache.set(turno.nombre, turno.id);
        });

        return this.cache;
    };

    //helper
    private async getOrCreateTurno(nombre: string): Promise<number> {
        const cached = this.idCache.get(nombre);

        if (cached) return cached;

        let turno = await this.turnoRepository.findOne({
            where: { nombre: nombre }
        });

        if (!turno) {
            turno = this.turnoRepository.create({ nombre: nombre });
            turno = await this.turnoRepository.save(turno);

            this.cache = null;
        };

        this.idCache.set(nombre, turno.id);

        return turno.id;
    };

    //Get turno nocturno
    async getTurnoNocturno(): Promise<number> {
        return this.getOrCreateTurno('Nocturno');
    };
};
