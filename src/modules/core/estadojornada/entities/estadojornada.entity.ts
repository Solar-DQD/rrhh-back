import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('estadojornada')
export class EstadoJornada {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};