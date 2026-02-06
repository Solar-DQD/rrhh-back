import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipoimportacion')
export class TipoImportacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};