import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('estadousuario')
export class EstadoUsuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};