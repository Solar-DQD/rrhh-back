import { Mes } from "src/modules/mes/entities/mes.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Unique(['quincena', 'id_mes'])
@Entity('quincena')
export class Quincena {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quincena: number;

    @Column()
    id_mes: number;

    @ManyToOne(() => Mes)
    @JoinColumn({ name: 'id_mes'})
    mes: Mes;
};