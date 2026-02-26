import { Entity, PrimaryColumn } from "typeorm";

@Entity('año')
export class Año {
    @PrimaryColumn()
    valor: number;
};