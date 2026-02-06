import { Año } from "src/modules/año/entities/año.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Unique(['mes', 'id_año'])
@Entity('mes')
export class Mes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mes: number;

    @Column()
    id_año: number;

    @ManyToOne(() => Año)
    @JoinColumn({ name: 'id_año'})
    año: Año;
};