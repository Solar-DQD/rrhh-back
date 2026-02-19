import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('modalidadtrabajo')
export class ModalidadTrabajo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};