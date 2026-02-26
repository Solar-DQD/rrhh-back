import { EstadoParametro } from "src/modules/core/estadoparametro/entities/estadoparametro.entity";
import { ModalidadTrabajo } from "src/modules/core/modalidadtrabajo/entities/modalidadtrabajo.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('proyecto')
export class Proyecto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nombre: string;

    @Column({ unique: true })
    nomina: string;

    @Column()
    id_modalidadtrabajo: number;

    @Column()
    id_estadoparametro: number;

    @ManyToOne(() => ModalidadTrabajo)
    @JoinColumn({ name: 'id_modalidadtrabajo' })
    modalidadtrabajo: ModalidadTrabajo

    @ManyToOne(() => EstadoParametro)
    @JoinColumn({ name: 'id_estadoparametro' })
    estadoparametro: EstadoParametro
};