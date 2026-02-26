import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('estadoempleado')
export class EstadoEmpleado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};