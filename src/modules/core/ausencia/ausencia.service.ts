import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ausencia } from './entities/ausencia.entity';
import { Repository } from 'typeorm';
import { CreateAusenciaDto } from './dto/create-ausencia.dto';
import { EditAusenciaDto } from './dto/edit-ausencia.dto';

@Injectable()
export class AusenciaService {
    constructor(
        @InjectRepository(Ausencia)
        private ausenciaRepository: Repository<Ausencia>
    ) { }

    //Create ausencia
    async createAusencia(params: CreateAusenciaDto): Promise<number> {
        let ausencia = this.ausenciaRepository.create({ id_empleado: params.id_empleado, id_tipoausencia: params.id_tipoausencia });
        ausencia = await this.ausenciaRepository.save(ausencia);

        return ausencia.id;
    };

    //Edit ausencia
    async editAusencia(params: EditAusenciaDto): Promise<void> {
        const result = await this.ausenciaRepository.update(
            {
                id: params.id
            },
            {
                id_tipoausencia: params.id_tipoausencia
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Ausencia with id ${params.id} not found or cannot be edited`);
        };
    };
};
