import { EstadoParametro } from "src/modules/core/estadoparametro/entities/estadoparametro.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipoausencia')
export class TipoAusencia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @Column()
    id_estadoparametro: number;

    @ManyToOne(() => EstadoParametro)
    @JoinColumn({ name: 'id_estadoparametro' })
    estadoparametro: EstadoParametro;
};