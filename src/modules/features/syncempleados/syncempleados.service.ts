import { Injectable } from '@nestjs/common';
import { EmpleadoService } from 'src/modules/core/empleado/empleado.service';
import { EstadoEmpleadoService } from 'src/modules/core/estadoempleado/estadoempleado.service';
import { ModalidadValidacionService } from 'src/modules/core/modalidadvalidacion/modalidadvalidacion.service';
import { ProyectoService } from 'src/modules/core/proyecto/proyecto.service';
import { TipoEmpleadoService } from 'src/modules/core/tipoempleado/tipoempleado.service';
import { NominaService } from 'src/modules/mssql/nomina/nomina.service';

@Injectable()
export class SyncEmpleadosService {
    constructor(
        private nominaService: NominaService,
        private empleadoService: EmpleadoService,
        private tipoEmpleadoService: TipoEmpleadoService,
        private estadoEmpleadoService: EstadoEmpleadoService,
        private proyectoService: ProyectoService,
        private modalidadValidacionService: ModalidadValidacionService
    ) { }

    //Sync empleado table with nomina table
    async syncEmpleadoWithNomina(): Promise<void> {
        const nomina = await this.nominaService.getNominaActiva();
        const nominaMap = new Map();

        nomina.forEach(fila => {
            nominaMap.set(fila.dni, {
                legajo: fila['legajo'],
                apellido: fila['apellido'],
                nombre: fila['nombre'],
                proyecto: fila['proyecto'],
                convenio: fila['convenio']
            });
        });

        const empleados = await this.empleadoService.getAllEmpleados();
        const empleadosMap = new Map(empleados.map(empleado => [empleado.dni, empleado]));
        
        const missing = empleados.filter(empleado => !nominaMap.has(empleado.dni));
        const dnis = new Set(empleados.map(empleado => empleado.dni));

        const id_tipoempleadomensual = await this.tipoEmpleadoService.getTipoEmpleadoMensual();
        const id_tipoempleadojornalero = await this.tipoEmpleadoService.getTipoEmpleadoJornalero();
        const id_estadoempleadoactivo = await this.estadoEmpleadoService.getEstadoEmpleadoActivo();
        const id_modalidadvalidacion = await this.modalidadValidacionService.getModalidadValidacionAutomatica();

        const updatePromises: Promise<any>[] = [];
        const createPromises: Promise<any>[] = [];
        const deactivatePromises: Promise<any>[] = [];

        for (const [dni, data] of nominaMap.entries()) {
            if (dnis.has(dni)) { //if employee exists in empleado and nomina, it updates
                const empleado = empleadosMap.get(dni);
                const id_proyecto = await this.proyectoService.getProyectoByNomina({ nomina: data.proyecto });

                if (id_proyecto === null) continue;

                const nombre = `${data.apellido} ${data.nombre}`.trim();

                if (data.convenio === 'FUERA DE CONVENIO') {
                    updatePromises.push(this.empleadoService.editEmpleadoSync({ 
                        id: empleado!.id, 
                        legajo: data.legajo,
                        nombre, 
                        id_proyecto, 
                        id_tipoempleado: id_tipoempleadomensual,
                        id_estadoempleado: id_estadoempleadoactivo,
                        id_modalidadvalidacion: empleado!.id_modalidadvalidacion === null ? id_modalidadvalidacion : empleado!.id_modalidadvalidacion,
                    }));
                } else {
                    updatePromises.push(this.empleadoService.editEmpleadoSync({ 
                        id: empleado!.id, 
                        legajo: data.legajo,
                        nombre, 
                        id_proyecto, 
                        id_tipoempleado: id_tipoempleadojornalero,
                        id_estadoempleado: id_estadoempleadoactivo,
                        id_modalidadvalidacion: empleado!.id_modalidadvalidacion === null ? id_modalidadvalidacion : empleado!.id_modalidadvalidacion,
                    }));
                };
            } else { //if employee doesnt exist in empleado but does exist in nomina, it creates
                const id_proyecto = await this.proyectoService.getProyectoByNomina({ nomina: data.proyecto });

                if (id_proyecto === null) continue;

                const nombre = `${data.apellido} ${data.nombre}`.trim();

                if (data.convenio === 'FUERA DE CONVENIO') {
                    createPromises.push(this.empleadoService.createEmpleado({
                        dni: dni,
                        legajo: data.legajo,
                        nombre, 
                        id_proyecto, 
                        id_tipoempleado: id_tipoempleadomensual
                    }));
                } else {
                    createPromises.push(this.empleadoService.createEmpleado({
                        dni: dni,
                        legajo: data.legajo,
                        nombre, 
                        id_proyecto, 
                        id_tipoempleado: id_tipoempleadojornalero
                    }));
                };
            };
        };

        for (const empleado of missing) { // //if employee exists in empleado but not in nomina, it deactivates
            deactivatePromises.push(this.empleadoService.deactivateEmpleado({ id: empleado.id }))
        };

        await Promise.allSettled([...updatePromises, ...createPromises, ...deactivatePromises]);
    };
};
