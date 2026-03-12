import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mes } from './entities/mes.entity';
import { Repository } from 'typeorm';
import { GetMesByMesAndAñoDto } from './dto/get-mes-mes-año.dto';

@Injectable()
export class MesService {
    private cache: Mes[] | null = null;
    private cacheByMesAndAño: Map<string, number> = new Map();

    constructor(
        @InjectRepository(Mes)
        private mesRepository: Repository<Mes>
    ) { }

    //Get all
    async getMeses(): Promise<Mes[]> {
        if (this.cache) return this.cache;

        this.cache = await this.mesRepository.find({
            order: {
                id_año: 'DESC',
                mes: 'DESC',
            },
        });

        return this.cache;
    };

    //Get mes by mes and año
    async getMesByMesAndAño(params: GetMesByMesAndAñoDto): Promise<number> {
        const key = `${params.id_año}-${params.mes}`;
        const cached = this.cacheByMesAndAño.get(key);

        if (cached !== undefined) return cached;

        let mes = await this.mesRepository.findOne({
            select: { id: true },
            where: { mes: params.mes, id_año: params.id_año }
        });

        if (!mes) {
            mes = this.mesRepository.create({ mes: params.mes, id_año: params.id_año });
            mes = await this.mesRepository.save(mes);

            this.cache = null;
        };

        this.cacheByMesAndAño.set(key, mes.id);

        return mes.id;
    };
};
