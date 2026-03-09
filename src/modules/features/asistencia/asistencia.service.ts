import { Injectable } from '@nestjs/common';
import { NominaService } from 'src/modules/mssql/nomina/nomina.service';
import { RegistrosAccesoService } from 'src/modules/mssql/registros_acceso/registros_acceso.service';
import { GetAusentesByProyectoAndFechasDto } from './dto/get-ausentes.dto';
import { ProyectoService } from 'src/modules/core/proyecto/proyecto.service';
import { AsistenciaResponseDto, GetAsistenciaProyectoDto } from './dto/get-asistencia-proyecto.dto';
import { ControlService } from 'src/modules/core/control/control.service';
import { EmpleadoService } from 'src/modules/core/empleado/empleado.service';
import { TipoEmpleadoService } from 'src/modules/core/tipoempleado/tipoempleado.service';

@Injectable()
export class AsistenciaService {
    constructor(
        private nominaService: NominaService,
        private registrosAccesoService: RegistrosAccesoService,
        private proyectoService: ProyectoService,
        private controlService: ControlService,
        private empleadoService: EmpleadoService,
        private tipoEmpleadoService: TipoEmpleadoService
    ) { }

    //Get asistencia by proyecto
    async getAsistenciaProyecto(params: GetAsistenciaProyectoDto): Promise<AsistenciaResponseDto> {
        const controles = await this.controlService.getControlesByProyecto({ id_proyecto: params.id_proyecto });
        const id_tipoempleadomensual = await this.tipoEmpleadoService.getTipoEmpleadoMensual();

        const fechaFormated = params.fecha.split('-').reverse().join('-');

        const accesos = await this.registrosAccesoService.getAccesosByFechaAndProyecto({ fecha: fechaFormated, dispositivos: controles }); //obtains distinct employee dni that have access that day
        const empleados = await this.empleadoService.getEmpleadosAsistencia(); //obtains employee data in an array

        const dnisPresentes = new Set(accesos.map(acceso => acceso.dni)); //makes a Set of dnis
        const presentes = empleados.empleados.filter(empleado => dnisPresentes.has(empleado.dni)); //gets an array, filtering empleados array and keeping those whose dni is included in the dni Set

        let presentesPaginated;

        if (params.page !== undefined && params.limit !== undefined) {
            const inicio = params.page * params.limit;
            const fin = inicio + params.limit;
            presentesPaginated = presentes.slice(inicio, fin);
        } else {
            presentesPaginated = presentes
        };

        const dnisAusentes = await this.getAusentesByProyectoAndFecha({ fecha: fechaFormated, id_proyecto: params.id_proyecto }); //obtains an array of dnis of employees not present that day
        const ausentes = empleados.empleados.filter(empleado => dnisAusentes.includes(empleado.dni)); //gets an array, filtering empleados array and keeping those whose dni is included in dnisAusentes array

        let ausentesPaginated;

        if (params.page !== undefined && params.limit !== undefined) {
            const inicio = params.page * params.limit;
            const fin = inicio + params.limit;
            ausentesPaginated = ausentes.slice(inicio, fin);
        } else {
            ausentesPaginated = ausentes
        };

        return {
            totalMensuales: presentes.filter(empleado => empleado.id_tipoempleado === id_tipoempleadomensual).length,
            totalJornaleros: presentes.filter(empleado => empleado.id_tipoempleado != id_tipoempleadomensual).length,
            totalPresentes: presentes.length,
            totalAusentes: ausentes.length,
            presentes: presentesPaginated,
            ausentes: ausentesPaginated
        };
    };

    //Get ausentes by proyecto
    async getAusentesByProyectoAndFecha(params: GetAusentesByProyectoAndFechasDto): Promise<string[]> {
        const proyecto = await this.proyectoService.getProyectoNomina({ id: params.id_proyecto });

        if (proyecto === null) {
            return [];
        };

        const nomina = await this.nominaService.getNominaActivaByProyecto({ proyecto });
        const accesos = await this.registrosAccesoService.getAccesosByFecha({ fecha: params.fecha });

        const dnis = new Set(nomina.map(fila => fila.dni));
        const presentes = new Set(accesos.map(acceso => acceso.dni));

        const ausentes = [...dnis].filter(dni => !presentes.has(dni));

        return ausentes;
    };
};
