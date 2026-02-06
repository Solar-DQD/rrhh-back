import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('estadoparametro')
export class EstadoParametro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};