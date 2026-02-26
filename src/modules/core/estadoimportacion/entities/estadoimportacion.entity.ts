import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('estadoimportacion')
export class EstadoImportacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};