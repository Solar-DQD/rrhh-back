import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { EstadoJornada } from "../../estadojornada/entities/estadojornada.entity";
import { FuenteMarca } from "../../fuentemarca/entities/fuentemarca.entity";
import { Ausencia } from "../../ausencia/entities/ausencia.entity";
import { Importacion } from "../../importacion/entities/importacion.entity";
import { Empleado } from "../../empleado/entities/empleado.entity";
import { Proyecto } from "../../proyecto/entities/proyecto.entity";
import { Mes } from "../../mes/entities/mes.entity";
import { Quincena } from "../../quincena/entities/quincena.entity";
import { TipoJornada } from "../../tipojornada/entities/tipojornada.entity";

@Entity('jornada')
export class Jornada {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'time', nullable: true })
    entrada: string;

    @Column({ type: 'time', nullable: true })
    salida: string;

    @Column({ type: 'time', nullable: true })
    entrada_r: string;

    @Column({ type: 'time', nullable: true })
    salida_r: string;

    @Column({ type: 'numeric', nullable: true })
    total: number;

    @Column({ type: 'numeric', nullable: true })
    total_normal: number;

    @Column({ type: 'numeric', nullable: true })
    total_50: number;

    @Column({ type: 'numeric', nullable: true })
    total_100: number;

    @Column({ type: 'numeric', nullable: true })
    total_feriado: number;

    @Column({ type: 'numeric', nullable: true })
    total_nocturno: number;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
    fechacreacion: Date;

    @Column({ type: 'date', nullable: true })
    fechamodificacion: Date;

    @Column({ type: 'date', nullable: true })
    fechavalidacion: Date;

    @Column()
    id_tipojornada: number;

    @Column()
    id_quincena: number;

    @Column()
    id_mes: number;

    @Column()
    id_proyecto: number;

    @Column()
    id_empleado: number;

    @Column({ nullable: true })
    id_importacion: number;

    @Column({ nullable: true })
    id_ausencia: number;

    @Column({ nullable: true })
    id_estadojornada: number;

    @Column({ nullable: true })
    id_fuentemarca: number;

    @Column()
    id_usuariocreacion: number;

    @Column({ nullable: true })
    id_usuariomodificacion: number;

    @Column({ nullable: true })
    id_usuariovalidacion: number;

    @ManyToOne(() => TipoJornada)
    @JoinColumn({ name: 'id_tipojornada' })
    tipojornada: TipoJornada;

    @ManyToOne(() => Quincena)
    @JoinColumn({ name: 'id_quincena' })
    quincena: Quincena;

    @ManyToOne(() => Mes)
    @JoinColumn({ name: 'id_mes' })
    mes: Mes;

    @ManyToOne(() => Proyecto)
    @JoinColumn({ name: 'id_proyecto' })
    proyecto: Proyecto;

    @ManyToOne(() => Empleado)
    @JoinColumn({ name: 'id_empleado' })
    empleado: Empleado;

    @ManyToOne(() => Importacion)
    @JoinColumn({ name: 'id_importacion' })
    importacion: Importacion;

    @ManyToOne(() => Ausencia)
    @JoinColumn({ name: 'id_ausencia' })
    ausencia: Ausencia;

    @ManyToOne(() => EstadoJornada)
    @JoinColumn({ name: 'id_estadojornada' })
    estadojornada: EstadoJornada;

    @ManyToOne(() => FuenteMarca)
    @JoinColumn({ name: 'id_fuentemarca' })
    fuentemarca: FuenteMarca;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuariocreacion' })
    usuariocreacion: Usuario;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuariomodificacion' })
    usuariomodificacion: Usuario;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuariovalidacion' })
    usuariovalidacion: Usuario;
};