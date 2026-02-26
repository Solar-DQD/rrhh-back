import { EstadoEmpleado } from "src/modules/core/estadoempleado/entities/estadoempleado.entity";
import { ModalidadValidacion } from "src/modules/core/modalidadvalidacion/entities/modalidadvalidacion.entity";
import { Proyecto } from "src/modules/core/proyecto/entities/proyecto.entity";
import { TipoEmpleado } from "src/modules/core/tipoempleado/entities/tipoempleado.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('empleado')
export class Empleado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    dni: bigint;

    @Column()
    legajo: number;

    @Column()
    id_proyecto: number;

    @Column()
    id_modalidadvalidacion: number;

    @Column()
    id_estadoempleado: number;

    @Column()
    id_tipoempleado: number;

    @ManyToOne(() => Proyecto)
    @JoinColumn({ name: 'id_proyecto' })
    proyecto: Proyecto;

    @ManyToOne(() => ModalidadValidacion)
    @JoinColumn({ name: 'id_modalidadvalidacion' })
    modalidadvalidacion: ModalidadValidacion;

    @ManyToOne(() => EstadoEmpleado)
    @JoinColumn({ name: 'id_estadoempleado' })
    estadoempleado: EstadoEmpleado;

    @ManyToOne(() => TipoEmpleado)
    @JoinColumn({ name: 'id_usuariocreacion' })
    tipoempleado: TipoEmpleado;

    @Column({ select: false, insert: false, update: false, nullable: true })
    es_mensualizado: boolean;
};