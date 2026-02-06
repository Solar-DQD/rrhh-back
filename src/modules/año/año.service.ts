import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Año } from './entities/año.entity';
import { Repository } from 'typeorm';
import { GetAñoByValorDto } from './dto/get-año-valor.dto';

@Injectable()
export class AñoService {
    private cache: Set<number> = new Set();

    constructor(
        @InjectRepository(Año)
        private añoRepository: Repository<Año>
    ) { }

    //Get año by valor
    async getAñoByValor(params: GetAñoByValorDto): Promise<number> {
        if (this.cache.has(params.valor)) return params.valor;

        let año = await this.añoRepository.findOne({
            where: { valor: params.valor }
        });

        if (!año) {
            año = this.añoRepository.create({ valor: params.valor });
            año = await this.añoRepository.save(año);
        };

        this.cache.add(año.valor);

        return año.valor
    };
};
