import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('observacion')
export class Observacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    texto: string;

    @Column()
    id_jornada: number;

    @ManyToOne(() => Jornada)
    @JoinColumn({ name: 'id_jornada' })
    jornada: Jornada
};