import { ConflictException, Injectable } from '@nestjs/common';
import { AusenciaService } from 'src/modules/core/ausencia/ausencia.service';
import { AñoService } from 'src/modules/core/año/año.service';
import { ControlService } from 'src/modules/core/control/control.service';
import { EmpleadoService } from 'src/modules/core/empleado/empleado.service';
import { EstadoImportacionService } from 'src/modules/core/estadoimportacion/estadoimportacion.service';
import { EstadoJornadaService } from 'src/modules/core/estadojornada/estadojornada.service';
import { FuenteMarcaService } from 'src/modules/core/fuentemarca/fuentemarca.service';
import { ImportacionService } from 'src/modules/core/importacion/importacion.service';
import { JornadaService } from 'src/modules/core/jornada/jornada.service';
import { MesService } from 'src/modules/core/mes/mes.service';
import { ModalidadTrabajoService } from 'src/modules/core/modalidadtrabajo/modalidadtrabajo.service';
import { ProyectoService } from 'src/modules/core/proyecto/proyecto.service';
import { QuincenaService } from 'src/modules/core/quincena/quincena.service';
import { TipoImportacionService } from 'src/modules/core/tipoimportacion/tipoimportacion.service';
import { AccesosReturn } from 'src/modules/mssql/registros_acceso/dto/get-accesos.dto';
import { RegistrosAccesoService } from 'src/modules/mssql/registros_acceso/registros_acceso.service';
import { AsistenciaService } from '../asistencia/asistencia.service';
import { TipoJornadaService } from 'src/modules/core/tipojornada/tipojornada.service';
import { TipoAusenciaService } from 'src/modules/core/tipoausencia/tipoausencia.service';
import { ImportJornadasHikVisionDto, ProcessJornadasHikVisionDto } from './dto/import-jornadas-hikvision.dto';
import { ExcelService } from '../excel/excel.service';
import { ImportJornadasProSoftDto, ProcessJornadasProSoftDto } from './dto/import-jornadas-prosoft.dto';
import { saveAusenciasDto } from './dto/save-ausencias.dto';
import { Acceso, AccesoOrdenado, AccesosPair, EmpleadoAccesos, SaveProcesedJornadasDto } from './dto/save-jornadas.dto';

@Injectable()
export class ImportarService {
    constructor(
        private readonly controlService: ControlService,
        private readonly registrosAccesoService: RegistrosAccesoService,
        private readonly proyectoService: ProyectoService,
        private readonly empleadoService: EmpleadoService,
        private readonly modalidadTrabajoService: ModalidadTrabajoService,
        private readonly estadoImportacionService: EstadoImportacionService,
        private readonly tipoImportacionService: TipoImportacionService,
        private readonly importacionService: ImportacionService,
        private readonly estadoJornadaService: EstadoJornadaService,
        private readonly fuenteMarcaService: FuenteMarcaService,
        private readonly añoService: AñoService,
        private readonly mesService: MesService,
        private readonly quincenaService: QuincenaService,
        private readonly jornadaService: JornadaService,
        private readonly ausenciaService: AusenciaService,
        private readonly asistenciaService: AsistenciaService,
        private readonly tipoJornadaService: TipoJornadaService,
        private readonly tipoAusenciaService: TipoAusenciaService,
        private readonly excelService: ExcelService
    ) { }

    //import orchestrator for hikvision
    async importJornadasHikVision(params: ImportJornadasHikVisionDto): Promise<number> {
        const proyectosHikvision = await this.controlService.getControlesProyectosIds();
        const id_tipoimportacion = await this.tipoImportacionService.getTipoImportacionHikVision();

        if (!proyectosHikvision.includes(params.id_proyecto)) {
            throw new ConflictException(`Proyecto with id ${params.id_proyecto} does not have HikVision clocks for access control`)
        };

        const fecha = params.fecha.split('-').reverse().join('-');

        const dispositivos = await this.controlService.getControlesByProyecto({ id_proyecto: params.id_proyecto });
        const accesos = await this.registrosAccesoService.getAccesos({ fecha: fecha, dispositivos: dispositivos });

        const empleadosAccesos = await this.processJornadasHikVision({ accesos, id_proyecto: params.id_proyecto });

        const id_importacion = await this.saveProcesedJornadas({
            empleadosAccesos,
            id_tipoimportacion: id_tipoimportacion,
            id_proyecto: params.id_proyecto,
            id_tipojornada: params.id_tipojornada,
            nombre: `Importación del día ${params.fecha}`,
            id_usuariocreacion: params.id_usuariocreacion
        });

        const ausentes = await this.asistenciaService.getAusentesByProyectoAndFecha({ fecha: fecha, id_proyecto: params.id_proyecto });

        await this.saveAusencias({
            fecha: params.fecha,
            id_proyecto: params.id_proyecto,
            ausentes: ausentes,
            id_usuariocreacion: params.id_usuariocreacion,
            id_importacion: id_importacion,
            id_tipoimportacion: id_tipoimportacion
        });

        return id_importacion;
    };

    //Process registros acceso HikVision to get entradas and salidas grouped by empleado
    async processJornadasHikVision(params: ProcessJornadasHikVisionDto): Promise<Map<string, EmpleadoAccesos>> {
        const modalidad_proyecto = await this.proyectoService.getProyectoModalidadTrabajo({ id: params.id_proyecto });
        const modalidad_corrido = await this.modalidadTrabajoService.getModalidadTrabajoCorrido();

        const empleadosModalidadValidacionManual = new Set(await this.empleadoService.getEmpleadosModalidadValidacionManual());

        const empleadosAccesos = new Map<string, EmpleadoAccesos>();
        const accesosEmpleado = new Map<string, AccesosReturn[]>();

        const TOLERANCIA = 5 //minutos

        params.accesos.forEach(acceso => {
            if (!accesosEmpleado.has(acceso.dni)) {
                accesosEmpleado.set(acceso.dni, []);
            };
            accesosEmpleado.get(acceso.dni)!.push(acceso);
        });

        accesosEmpleado.forEach((accesos, dni) => {
            //ordenar por hora
            const accesosOrdenados = [...accesos].sort((a, b) => {
                const horaA = new Date(a.fecha_hora_acceso).getTime();
                const horaB = new Date(b.fecha_hora_acceso).getTime();
                return horaA - horaB;
            });

            //filter en intervalo de tolerancia
            const accesosFiltrados = accesosOrdenados.filter((acceso, index) => {
                if (index === 0) return true;

                const horaActual = new Date(acceso.fecha_hora_acceso).getTime();
                const horaAnterior = new Date(accesosOrdenados[index - 1].fecha_hora_acceso).getTime();

                const diferencia = (horaActual - horaAnterior) / (1000 * 60);

                return diferencia > TOLERANCIA;
            });

            const accesosProcesados: Acceso[] = []
            let validacionManual = false;
            let incompleto = false;

            if (accesosFiltrados.length === 0) return;

            if (empleadosModalidadValidacionManual.has(dni)) {
                validacionManual = true;
            };

            if (modalidad_proyecto === modalidad_corrido) {
                //Solo primer y ultimo acceso
                if (accesosFiltrados.length === 1) {
                    const marca = accesosFiltrados[0];
                    const fecha = new Date(marca.fecha_acceso);
                    const hora = new Date(marca.hora_acceso);

                    accesosProcesados.push({
                        fecha: fecha.toISOString().split('T')[0],
                        hora: `${hora.getHours().toString().padStart(2, '0')}:${hora.getMinutes().toString().padStart(2, '0')}`,
                        tipo: 'ENTRADA'
                    });

                    accesosProcesados.push({
                        fecha: fecha.toISOString().split('T')[0],
                        hora: '',
                        tipo: 'SALIDA'
                    });

                    validacionManual = true;
                    incompleto = true;
                } else {
                    const entrada = accesosOrdenados[0];
                    const salida = accesosOrdenados[accesosOrdenados.length - 1];

                    const fechaEntrada = new Date(entrada.fecha_acceso);
                    const horaEntrada = new Date(entrada.hora_acceso);

                    const fechaSalida = new Date(salida.fecha_acceso);
                    const horaSalida = new Date(salida.hora_acceso);

                    accesosProcesados.push({
                        fecha: fechaEntrada.toISOString().split('T')[0],
                        hora: `${horaEntrada.getHours().toString().padStart(2, '0')}:${horaEntrada.getMinutes().toString().padStart(2, '0')}`,
                        tipo: 'ENTRADA'
                    });
                    accesosProcesados.push({
                        fecha: fechaSalida.toISOString().split('T')[0],
                        hora: `${horaSalida.getHours().toString().padStart(2, '0')}:${horaSalida.getMinutes().toString().padStart(2, '0')}`,
                        tipo: 'SALIDA'
                    });

                };
            } else {
                for (let index = 0; index < accesosFiltrados.length; index += 2) {
                    const entrada = accesosFiltrados[index];
                    const salida = accesosFiltrados[index + 1];

                    const fechaEntrada = new Date(entrada.fecha_acceso);
                    const horaEntrada = new Date(entrada.hora_acceso);

                    accesosProcesados.push({
                        fecha: fechaEntrada.toISOString().split('T')[0],
                        hora: `${horaEntrada.getUTCHours().toString().padStart(2, '0')}:${horaEntrada.getUTCMinutes().toString().padStart(2, '0')}`,
                        tipo: 'ENTRADA'
                    });

                    if (salida) {
                        const fechaSalida = new Date(salida.fecha_acceso);
                        const horaSalida = new Date(salida.hora_acceso);

                        accesosProcesados.push({
                            fecha: fechaSalida.toISOString().split('T')[0],
                            hora: `${horaSalida.getUTCHours().toString().padStart(2, '0')}:${horaSalida.getUTCMinutes().toString().padStart(2, '0')}`,
                            tipo: 'SALIDA'
                        });
                    } else {
                        accesosProcesados.push({
                            fecha: fechaEntrada.toISOString().split('T')[0],
                            hora: '',
                            tipo: 'SALIDA'
                        });
                    };
                };

                if (accesosFiltrados.length % 2 !== 0) {
                    validacionManual = true;
                    incompleto = true;
                };
            };

            if (!validacionManual && !empleadosModalidadValidacionManual.has(dni) && accesosProcesados.length >= 2) {
                let total = 0;

                for (let index = 0; index < accesosProcesados.length; index += 2) {
                    const entrada = accesosProcesados[index];
                    const salida = accesosProcesados[index + 1];

                    if (entrada && salida && salida.hora !== '') {
                        const fechaHoraEntrada = new Date(`${entrada.fecha}T${entrada.hora}:00`);
                        const fechaHoraSalida = new Date(`${salida.fecha}T${salida.hora}:00`);

                        total += (fechaHoraSalida.getTime() - fechaHoraEntrada.getTime()) / (1000 * 60 * 60);
                    } else {
                        validacionManual = true;
                        incompleto = true;

                        break;
                    };
                };

                if (total < 8) {
                    validacionManual = true;
                };
            };

            empleadosAccesos.set(dni, {
                nombre: accesosFiltrados[0].nombre,
                accesos: accesosProcesados,
                validacionManual,
                incompleto
            });
        });

        return empleadosAccesos;
    };

    //import orchestrator for prosoft
    async importJornadasProSoft(params: ImportJornadasProSoftDto): Promise<number> {
        const id_tipoimportacion = await this.tipoImportacionService.getTipoImportacionProSoft();

        const empleadosAccesos = await this.processJornadasProSoft({ id_proyecto: params.id_proyecto, file: params.file });

        const id_importacion = await this.saveProcesedJornadas({
            empleadosAccesos,
            id_tipoimportacion: id_tipoimportacion,
            id_proyecto: params.id_proyecto,
            id_tipojornada: params.id_tipojornada,
            nombre: params.file.filename,
            id_usuariocreacion: params.id_usuariocreacion
        });

        return id_importacion;
    };

    //Process excell from prosoft to get entradas and salidas grouped by empleado
    async processJornadasProSoft(params: ProcessJornadasProSoftDto): Promise<Map<string, EmpleadoAccesos>> {
        const modalidad_proyecto = await this.proyectoService.getProyectoModalidadTrabajo({ id: params.id_proyecto });
        const modalidad_corrido = await this.modalidadTrabajoService.getModalidadTrabajoCorrido();

        const empleadosModalidadValidacionManual = new Set(await this.empleadoService.getEmpleadosModalidadValidacionManual());

        const accesos = await this.excelService.parseExcelFile(params.file);
        const empleadosAccesos = new Map<string, EmpleadoAccesos>();

        const TOLERANCIA = 5;

        for (const [dni, data] of accesos.entries()) {
            const accesosOrdenados = [...data.registros].sort((a, b) => a.fechaHora.getTime() - b.fechaHora.getTime());

            const accesosFiltrados = accesosOrdenados.filter((registro, index) => {
                if (index === 0) return true;

                const diferencia = (registro.fechaHora.getTime() - accesosOrdenados[index - 1].fechaHora.getTime()) / (1000 * 60);

                return diferencia > TOLERANCIA;
            });

            if (accesosFiltrados.length === 0) continue;

            const accesosProcesados: Acceso[] = [];
            let validacionManual = empleadosModalidadValidacionManual.has(dni);
            let incompleto = false;

            if (modalidad_proyecto === modalidad_corrido) {
                if (accesosFiltrados.length === 1) {
                    const marca = accesosFiltrados[0];

                    accesosProcesados.push({
                        fecha: marca.fecha,
                        hora: marca.hora,
                        tipo: 'ENTRADA'
                    });
                    accesosProcesados.push({
                        fecha: marca.fecha,
                        hora: '',
                        tipo: 'SALIDA'
                    });

                    validacionManual = true;
                    incompleto = true;
                } else {
                    const entrada = accesosFiltrados[0];
                    const salida = accesosFiltrados[accesosFiltrados.length - 1];

                    accesosProcesados.push({
                        fecha: entrada.fecha,
                        hora: entrada.hora,
                        tipo: 'ENTRADA'
                    });
                    accesosProcesados.push({
                        fecha: salida.fecha,
                        hora: salida.hora,
                        tipo: 'SALIDA'
                    });
                };
            } else {
                for (let index = 0; index < accesosFiltrados.length; index += 2) {
                    const entrada = accesosFiltrados[index];
                    const salida = accesosFiltrados[index + 1];
                    accesosProcesados.push({ fecha: entrada.fecha, hora: entrada.hora, tipo: 'ENTRADA' });
                    if (salida) {
                        accesosProcesados.push({ fecha: salida.fecha, hora: salida.hora, tipo: 'SALIDA' });
                    } else {
                        accesosProcesados.push({ fecha: entrada.fecha, hora: '', tipo: 'SALIDA' });
                    };
                };
                if (accesosFiltrados.length % 2 !== 0) {
                    validacionManual = true;
                    incompleto = true;
                };
            };

            if (!validacionManual && !empleadosModalidadValidacionManual.has(dni) && accesosProcesados.length >= 2) {
                let total = 0;

                for (let index = 0; index < accesosProcesados.length; index += 2) {
                    const entrada = accesosProcesados[index];
                    const salida = accesosProcesados[index + 1];

                    if (entrada && salida && salida.hora !== '') {
                        const fechaHoraEntrada = new Date(`${entrada.fecha}T${entrada.hora}:00`);
                        const fechaHoraSalida = new Date(`${salida.fecha}T${salida.hora}:00`);
                        total += (fechaHoraSalida.getTime() - fechaHoraEntrada.getTime()) / (1000 * 60 * 60);
                    } else {
                        validacionManual = true;
                        incompleto = true;
                        break;
                    };
                };

                if (total < 8) {
                    validacionManual = true;
                };
            };

            empleadosAccesos.set(dni, {
                nombre: data.nombre,
                accesos: accesosProcesados,
                validacionManual,
                incompleto
            });
        };

        return empleadosAccesos;
    };

    //Save processed jornadas to database in corresponding empleado and proyecto, creating empleado if necesary
    async saveProcesedJornadas(params: SaveProcesedJornadasDto): Promise<number> {
        let fechaMemoria = new Date(0);
        let quincenaMemoria = 0;
        let id_mes = 0;
        let id_quincena = 0;

        const id_tipoimportacionprosoft = await this.tipoImportacionService.getTipoImportacionProSoft();

        const id_estadoimportacion = await this.estadoImportacionService.getEstadoImportacionIncompleta();

        const id_importacion = await this.importacionService.createImportacion({
            filename: params.nombre,
            id_proyecto: params.id_proyecto,
            id_estadoimportacion: id_estadoimportacion,
            id_tipoimportacion: params.id_tipoimportacion,
            id_usuariocreacion: params.id_usuariocreacion
        });

        const id_estadojornadavalida = await this.estadoJornadaService.getEstadoJornadaValida();
        const id_estadojornadarevision = await this.estadoJornadaService.getEstadoJornadaRevision();
        const id_estadojornadasinvalidar = await this.estadoJornadaService.getEstadoJornadaSinValidar();
        const id_fuentemarca = await this.fuenteMarcaService.getFuenteMarcaControl();

        for (const [dni, empleadoAccesos] of params.empleadosAccesos.entries()) {
            let id_empleado = await this.empleadoService.getEmpleadoByDni({ dni });

            if (!id_empleado) {
                id_empleado = await this.empleadoService.createEmpleado({
                    dni: dni,
                    nombre: empleadoAccesos.nombre,
                    id_proyecto: params.id_proyecto
                });
            };

            const accesosOrdenados: Map<string, AccesoOrdenado[]> = new Map();

            for (const acceso of empleadoAccesos.accesos) {
                if (!accesosOrdenados.has(acceso.fecha)) {
                    accesosOrdenados.set(acceso.fecha, []);
                };

                const accesosFecha = accesosOrdenados.get(acceso.fecha)!;

                accesosFecha.push({
                    tipo: acceso.tipo,
                    hora: acceso.hora,
                    orden: accesosFecha.length + 1
                });
            };

            for (const [fecha, accesosFecha] of accesosOrdenados.entries()) {
                const date = new Date(fecha + 'T12:00:00');
                const año = date.getFullYear();
                const mes = date.getMonth() + 1;
                const dia = date.getDate();
                const quincena = dia <= 15 ? 1 : 2;

                if (
                    fechaMemoria.getFullYear() !== año
                    || fechaMemoria.getMonth() + 1 !== mes
                    || id_mes === 0
                    || id_quincena === 0
                    || quincenaMemoria !== quincena
                ) {
                    fechaMemoria = date;
                    quincenaMemoria = quincena;

                    const id_año = await this.añoService.getAñoByValor({ valor: año });
                    id_mes = await this.mesService.getMesByMesAndAño({ mes, id_año });
                    id_quincena = await this.quincenaService.getQuincenaByQuincenaAndMes({ quincena, id_mes });
                };

                const jornadas: AccesosPair[] = [];

                const entradas = accesosFecha.filter(acceso => acceso.tipo === 'ENTRADA');
                const salidas = accesosFecha.filter(acceso => acceso.tipo === 'SALIDA');

                let indexEntrada = 0;
                let indexSalida = 0;

                while (indexEntrada < entradas.length || indexSalida < salidas.length) {
                    const jornada: AccesosPair = {};

                    if (indexEntrada < entradas.length) {
                        jornada.entrada = entradas[indexEntrada].hora;
                        indexEntrada++;
                    };

                    if (indexSalida < salidas.length) {
                        jornada.salida = salidas[indexSalida].hora;
                        indexSalida++;
                    };

                    jornadas.push(jornada);

                    if (!jornada.entrada || !jornada.salida) {
                        break;
                    };
                };

                for (const jornada of jornadas) {
                    if (jornada.entrada || jornada.salida) {
                        if (params.id_tipoimportacion === id_tipoimportacionprosoft) {
                            const id_ausencia = await this.jornadaService.getJornadaAusenciaByEmpleado({ id_empleado, fecha });
                            if (id_ausencia) {
                                await this.ausenciaService.deleteAusencia({ id: id_ausencia });
                            };
                        };

                        let id_estadojornada;

                        if (!empleadoAccesos.validacionManual) {
                            id_estadojornada = id_estadojornadavalida;
                        } else if (empleadoAccesos.incompleto) {
                            id_estadojornada = id_estadojornadarevision;
                        } else {
                            id_estadojornada = id_estadojornadasinvalidar;
                        };

                        await this.jornadaService.createJornada({
                            fecha: fecha,
                            entrada: jornada.entrada || undefined,
                            salida: jornada.salida || undefined,
                            id_empleado: id_empleado,
                            id_proyecto: params.id_proyecto,
                            id_mes: id_mes,
                            id_quincena: id_quincena,
                            id_tipojornada: params.id_tipojornada,
                            id_ausencia: undefined,
                            id_estadojornada: empleadoAccesos.validacionManual ? id_estadojornadarevision : id_estadojornadavalida,
                            id_importacion: id_importacion,
                            id_fuentemarca: id_fuentemarca,
                            id_usuariocreacion: params.id_usuariocreacion,
                        });
                    };
                };
            };

            await this.jornadaService.recalculateJornadasEmpleado({ id_empleado: id_empleado });
        };

        return id_importacion;
    };

    //Save absences
    async saveAusencias(params: saveAusenciasDto): Promise<void> {
        const [dia, mes, año] = params.fecha.split("-").map(Number);
        const fecha = `${año}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
        const quincena = dia <= 15 ? 1 : 2;

        const id_año = await this.añoService.getAñoByValor({ valor: año });
        const id_mes = await this.mesService.getMesByMesAndAño({ mes, id_año });
        const id_quincena = await this.quincenaService.getQuincenaByQuincenaAndMes({ quincena, id_mes });

        const id_tipojornada = await this.tipoJornadaService.getTipoJornadaAusencia();
        const id_tipoausencia = await this.tipoAusenciaService.getTipoAusenciaPendiente();
        const id_fuentemarca = await this.fuenteMarcaService.getFuenteMarcaControl();
        const id_estadojornada = await this.estadoJornadaService.getEstadoJornadaSinValidar();

        for (const dni of params.ausentes) {
            const id_empleado = await this.empleadoService.getEmpleadoByDni({ dni });

            if (!id_empleado) {
                continue;
            };

            const id_ausencia = await this.ausenciaService.createAusencia({
                id_empleado: id_empleado,
                id_tipoausencia: id_tipoausencia,
            });

            await this.jornadaService.createJornada({
                fecha: fecha,
                id_empleado: id_empleado,
                id_proyecto: params.id_proyecto,
                id_mes: id_mes,
                id_quincena: id_quincena,
                id_tipojornada: id_tipojornada,
                id_ausencia: id_ausencia,
                id_estadojornada: id_estadojornada,
                id_importacion: params.id_importacion,
                id_fuentemarca: id_fuentemarca,
                id_usuariocreacion: params.id_usuariocreacion
            });
        };
    };
};
