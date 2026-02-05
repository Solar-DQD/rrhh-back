import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './entities/turno.entity';

@Injectable()
export class TurnoService {
    constructor(
        @InjectRepository(Turno)
        private turnoRepository: Repository<Turno>
    ) { }

    //Get all
    async getTurnos(): Promise<Turno[]> {
        return await this.turnoRepository.find();
    };

    //Get turno nocturno
    async getTurnoNocturno(): Promise<number> {
        let turno = await this.turnoRepository.findOne({
            where: { nombre: 'Nocturno' }
        });

        if (!turno) {
            turno = this.turnoRepository.create({ nombre: 'Nocturno' });
            turno = await this.turnoRepository.save(turno);
        };

        return turno.id;
    };
}
