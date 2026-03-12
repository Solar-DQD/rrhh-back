import { Proyecto } from "src/modules/core/proyecto/entities/proyecto.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('control')
export class Control {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    serie: string;

    @Column()
    id_proyecto: number;

    @ManyToOne(() => Proyecto)
    @JoinColumn({ name: 'id_proyecto' })
    proyecto: Proyecto;
};