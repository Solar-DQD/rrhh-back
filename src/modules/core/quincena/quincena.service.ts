import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quincena } from './entities/quincena.entity';
import { Repository } from 'typeorm';
import { GetQuincenaByQuincenaAndMesDto } from './dto/get-quincena-quincena-mes.dto';

@Injectable()
export class QuincenaService {
    constructor(
        @InjectRepository(Quincena)
        private quincenaRepository: Repository<Quincena>
    ) { }

    //Get quincena by mes
    async getQuincenaByQuincenaAndMes(params: GetQuincenaByQuincenaAndMesDto): Promise<number> {
        let quincena = await this.quincenaRepository.findOne({
            select: { id: true },
            where: { quincena: params.quincena, id_mes: params.id_mes }
        });

        if (!quincena) {
            quincena = this.quincenaRepository.create({ quincena: params.quincena, id_mes: params.id_mes });
            quincena = await this.quincenaRepository.save(quincena);
        };

        return quincena.id;
    };
};
