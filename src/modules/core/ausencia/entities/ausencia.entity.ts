import { TipoAusencia } from "src/modules/core/tipoausencia/entities/tipoausencia.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Empleado } from "../../empleado/entities/empleado.entity";

@Entity('ausencia')
export class Ausencia {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    id_tipoausencia: number;

    @Column()
    id_empleado: number;

    @ManyToOne(() => TipoAusencia)
    @JoinColumn({ name: 'id_tipoausencia' })
    tipoausencia: TipoAusencia;

    @ManyToOne(() => Empleado)
    @JoinColumn({ name: 'id_empleado' })
    empleado: Empleado;
};