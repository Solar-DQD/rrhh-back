import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('registros_acceso')
export class RegistroAcceso {
    @PrimaryColumn({ name: 'id_empleado', type: 'varchar', length: 300 })
    id_empleado: string;

    @PrimaryColumn({ name: 'fecha_hora_acceso', type: 'datetime2', precision: 0 })
    fecha_hora_acceso: Date;

    @Column({ name: 'fecha_acceso', type: 'date' })
    fecha_acceso: Date;

    @Column({ name: 'hora_acceso', type: 'time', precision: 0 })
    hora_acceso: string;

    @Column({ name: 'nombre_dispositivo', type: 'varchar', length: 300 })
    nombre_dispositivo: string;

    @Column({ name: 'numero_serie_dispositivo', type: 'varchar', length: 300 })
    numero_serie_dispositivo: string;

    @Column({ name: 'nombre', type: 'nvarchar', length: 100 })
    nombre: string;

    @Column({ name: 'direccion', type: 'varchar', length: 300 })
    direccion: string;

    @Column({ name: 'tarjeta_dni', type: 'varchar', length: 300 })
    tarjeta_dni: string;
};