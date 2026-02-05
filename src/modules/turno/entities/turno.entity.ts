import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('turno')
export class Turno {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};