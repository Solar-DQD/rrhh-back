import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipojornada')
export class TipoJornada {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};