import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipousuario')
export class TipoUsuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};