import { EstadoImportacion } from "src/modules/estadoimportacion/entities/estadoimportacion.entity";
import { Proyecto } from "src/modules/proyecto/entities/proyecto.entity";
import { TipoImportacion } from "src/modules/tipoimportacion/entities/tipoimportacion.entity";
import { Usuario } from "src/modules/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('importacion')
export class Importacion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: string;

    @Column()
    nombrearchivo: string;

    @Column()
    id_proyecto: number;

    @Column()
    id_estadoimportacion: number;

    @Column()
    id_tipoimportacion: number;

    @Column()
    id_usuariocreacion: number;

    @ManyToOne(() => Proyecto)
    @JoinColumn({ name: 'id_proyecto' })
    proyecto: Proyecto;

    @ManyToOne(() => EstadoImportacion)
    @JoinColumn({ name: 'id_estadoimportacion' })
    estadoimportacion: EstadoImportacion;

    @ManyToOne(() => TipoImportacion)
    @JoinColumn({ name: 'id_tipoimportacion' })
    tipoimportacion: TipoImportacion;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'id_usuariocreacion' })
    usuario: Usuario;
};