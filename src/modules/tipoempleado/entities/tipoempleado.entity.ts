import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipoempleado')
export class TipoEmpleado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};