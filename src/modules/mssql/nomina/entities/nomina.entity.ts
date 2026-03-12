import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'nomina' })
export class Nomina {
  @PrimaryColumn({ name: 'cuil' })
  cuil: string;

  @PrimaryColumn({ name: 'ingreso', type: 'datetime' })
  ingreso: Date;

  @Column({ nullable: true }) 
  proyecto: string;

  @Column({ nullable: true }) 
  legajo: string;
  
  @Column({ nullable: true }) 
  apellido: string;

  @Column({ nullable: true }) 
  nombre: string;

  @Column({ nullable: true }) 
  dni: string;

  @Column({ nullable: true }) 
  estado: string;

  @Column({ nullable: true, type: 'datetime' }) 
  egreso: Date;

  @Column({ nullable: true }) 
  convenio: string;

  @Column({ nullable: true }) 
  puesto: string;

  @Column({ nullable: true }) 
  correo: string;

  @Column({ nullable: true }) 
  telefono: string;
};