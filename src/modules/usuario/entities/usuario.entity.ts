import { EstadoUsuario } from "src/modules/estadousuario/entities/estadousuario.entity";
import { TipoUsuario } from "src/modules/tipousuario/entities/tipousuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    contraseña: string;

    @Column()
    correo: string;

    @Column()
    nombre: string;

    @Column()
    id_estadousuario: number;

    @Column()
    id_tipousuario: number;

    @ManyToOne(() => TipoUsuario)
    @JoinColumn({ name: 'id_tipousuario' })
    tipousuario: TipoUsuario;

    @ManyToOne(() => EstadoUsuario)
    @JoinColumn({ name: 'id_estadousuario' })
    estadousuario: EstadoUsuario;
};