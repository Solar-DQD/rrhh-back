import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('modalidadvalidacion')
export class ModalidadValidacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};