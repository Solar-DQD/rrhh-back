import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('fuentemarca')
export class FuenteMarca {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true})
    nombre: string;
};