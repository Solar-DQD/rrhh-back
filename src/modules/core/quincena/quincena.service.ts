import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quincena } from './entities/quincena.entity';
import { Repository } from 'typeorm';
import { GetQuincenaByQuincenaAndMesDto } from './dto/get-quincena-quincena-mes.dto';

@Injectable()
export class QuincenaService {
    private cache: Map<string, number> = new Map();

    constructor(
        @InjectRepository(Quincena)
        private quincenaRepository: Repository<Quincena>
    ) { }

    //Get quincena by mes
    async getQuincenaByQuincenaAndMes(params: GetQuincenaByQuincenaAndMesDto): Promise<number> {
        const key = `${params.id_mes}-${params.quincena}`;
        const cached = this.cache.get(key);

        if (cached !== undefined) return cached;
        
        let quincena = await this.quincenaRepository.findOne({
            select: { id: true },
            where: { quincena: params.quincena, id_mes: params.id_mes }
        });

        if (!quincena) {
            quincena = this.quincenaRepository.create({ quincena: params.quincena, id_mes: params.id_mes });
            quincena = await this.quincenaRepository.save(quincena);
        };

        this.cache.set(key, quincena.id);

        return quincena.id;
    };
};
