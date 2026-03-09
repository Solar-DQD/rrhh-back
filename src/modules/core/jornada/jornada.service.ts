import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jornada } from './entities/jornada.entity';
import { Repository } from 'typeorm';
import { GetJornadasByEmpleadoDto, JornadaResponseDto } from './dto/get-jornada-empleado.dto';
import { TipoAusenciaService } from '../tipoausencia/tipoausencia.service';
import { TipoJornadaService } from '../tipojornada/tipojornada.service';
import { GetResumenByEmpleadoDto, ResumenResponseDto } from './dto/get-resumen-empleado.dto';
import { GetResumenByEmpleadosDto, ResumenesResponseDto } from './dto/get-resumen-empleados.dto';
import { EstadoJornadaService } from '../estadojornada/estadojornada.service';
import { GetJornadasByImportacionDto, JornadasImportacionResponseDto } from './dto/get-jornadas-importacion.dto';
import { DeleteJornadaDto } from './dto/delete-jornada.dto';
import { FuenteMarcaService } from '../fuentemarca/fuentemarca.service';
import { EditJornadaDto } from './dto/edit-jornada.dto';
import { SetEstadoJornadaValidaDto } from './dto/set-jornada-valida.dto';
import { GetJornadaAusenciaDto } from './dto/get-jornada-ausencia.dto';
import { recalculateJornadasEmpleadoDto } from './dto/recalculate-jornadas.dto';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { AñoService } from '../año/año.service';
import { QuincenaService } from '../quincena/quincena.service';
import { MesService } from '../mes/mes.service';
import { EmpleadoService } from '../empleado/empleado.service';
import { AusenciaService } from '../ausencia/ausencia.service';
import { ObservacionService } from '../observacion/observacion.service';
import { CreateJornadaManualDto } from './dto/create-jornada-manual.dto';
import { EditAusenciaDto } from '../ausencia/dto/edit-ausencia.dto';
import { GetJornadaAusenciaByEmpleadoDto } from './dto/get-jornada-ausencia-empleado.dto';

@Injectable()
export class JornadaService {
    constructor(
        @InjectRepository(Jornada)
        private jornadaRepository: Repository<Jornada>,
        private tipoAusenciaService: TipoAusenciaService,
        private tipoJornadaService: TipoJornadaService,
        private estadoJornadaService: EstadoJornadaService,
        private fuenteMarcaService: FuenteMarcaService,
        private añoService: AñoService,
        private mesService: MesService,
        private quincenaService: QuincenaService,
        private empleadoService: EmpleadoService,
        private ausenciaService: AusenciaService,
        private observacionService: ObservacionService
    ) { }

    //Get jornadas by empleado
    async getJornadasByEmpleado(params: GetJornadasByEmpleadoDto): Promise<JornadaResponseDto> {
        const baseQuery = this.jornadaRepository
            .createQueryBuilder('j')
            .innerJoin('j.tipojornada', 'tj')
            .innerJoin('j.fuentemarca', 'fm')
            .leftJoin('j.ausencia', 'a')
            .leftJoin('tipoausencia', 'ta', 'a.id_tipoausencia = ta.id')
            .leftJoin('observacion', 'o', 'o.id_jornada = j.id')
            .where('j.id_empleado = :id_empleado', { id_empleado: params.id_empleado });

        if (params.id_mes !== undefined) {
            baseQuery.andWhere('j.id_mes = :id_mes', { id_mes: params.id_mes });
        };

        if (params.quincena !== undefined) {
            baseQuery.innerJoin('quincena', 'q', 'j.id_quincena = q.id')
                .andWhere('q.quincena = :quincena', { quincena: params.quincena });
        };

        if (params.ausencias) {
            baseQuery.andWhere('j.id_ausencia IS NOT NULL');
        };

        if (params.id_tipoausencia !== undefined && params.id_tipoausencia !== 0) {
            baseQuery.andWhere('a.id_tipoausencia = :id_tipoausencia', { id_tipoausencia: params.id_tipoausencia });
        };

        const totalJornadas = await baseQuery
            .clone()
            .select('COUNT(DISTINCT j.id)', 'total')
            .getRawOne()
            .then(r => parseInt(r.total, 10));

        const jornadas = await baseQuery
            .clone()
            .select([
                'j.id AS id',
                'j.fecha AS fecha',
                'j.entrada AS entrada',
                'j.salida AS salida',
                'j.entrada_r AS entrada_r',
                'j.salida_r AS salida_r',
                'j.total AS total',
                'tj.nombre AS tipojornada',
                'ta.nombre AS tipoausencia',
                'COALESCE(fm.nombre = :fuentemarca, false) AS es_manual',
                "array_agg(DISTINCT jsonb_build_object('id', o.id, 'texto', o.texto)) FILTER (WHERE o.texto IS NOT NULL) AS observaciones",
            ])
            .setParameter('fuentemarca', 'Manual')
            .groupBy('j.id')
            .addGroupBy('tj.nombre')
            .addGroupBy('ta.nombre')
            .addGroupBy('fm.nombre')
            .orderBy('j.fecha', 'DESC')
            .limit(params.limit)
            .offset(params.page * params.limit)
            .getRawMany();

        return {
            jornadas: jornadas.map(jornada => ({
                id: jornada.id,
                fecha: jornada.fecha,
                entrada: jornada.entrada,
                salida: jornada.salida,
                entrada_r: jornada.entrada_r,
                salida_r: jornada.salida_r,
                total: jornada.total,
                tipojornada: jornada.tipojornada,
                tipoausencia: jornada.tipoausencia,
                es_manual: jornada.es_manual,
                observaciones: jornada.observaciones,
            })),
            totalJornadas,
        };
    };

    //Get jornada resumen by empleado
    async getResumenByEmpleado(params: GetResumenByEmpleadoDto): Promise<ResumenResponseDto> {
        const id_tipoausencia = await this.tipoAusenciaService.getTipoAusenciaInjustificada();
        const id_tipojornada = await this.tipoJornadaService.getTipoJornadaAusencia();

        const query = this.jornadaRepository
            .createQueryBuilder('j')
            .select([
                'SUM(CAST(j.total AS DECIMAL)) AS suma_total',
                'SUM(CAST(j.total_normal AS DECIMAL)) AS suma_total_normal',
                'SUM(CAST(j.total_50 AS DECIMAL)) AS suma_total_50',
                'SUM(CAST(j.total_100 AS DECIMAL)) AS suma_total_100',
                'SUM(CAST(j.total_feriado AS DECIMAL)) AS suma_total_feriado',
                'SUM(CAST(j.total_nocturno AS DECIMAL)) AS suma_total_nocturno',
                'COUNT(j.id) FILTER (WHERE j.id_tipojornada != :id_tipojornada) AS total_asistencias',
                'COUNT(a.id) FILTER (WHERE a.id_tipoausencia = :id_tipoausencia) AS total_ausencias_injustificadas',
                'COUNT(a.id) FILTER (WHERE a.id_tipoausencia != :id_tipoausencia) AS total_ausencias_justificadas'
            ])
            .setParameter('id_tipojornada', id_tipojornada)
            .setParameter('id_tipoausencia', id_tipoausencia)
            .leftJoin('j.ausencia', 'a')
            .where('j.id_empleado = :id_empleado', { id_empleado: params.id_empleado });

        if (params.id_mes !== undefined) {
            query.andWhere('j.id_mes = :id_mes', { id_mes: params.id_mes });
        };

        if (params.quincena !== undefined) {
            query.innerJoin('quincena', 'q', 'j.id_quincena = q.id')
                .andWhere('q.quincena = :quincena', { quincena: params.quincena });
        };

        const resumen = await query.getRawOne();

        return {
            resumen
        };
    };

    //Get jornada resumen for all employees (used in report)
    async getResumenByEmpleados(params: GetResumenByEmpleadosDto): Promise<ResumenesResponseDto[]> {
        const valoresBase: any = [];

        let join = `JOIN empleado e ON j.id_empleado = e.id`;
        let joinSon = 'JOIN empleado e2 ON j2.id_empleado = e2.id';
        let filtro = `WHERE 1=1`;

        let mesIndex;
        let quincenaIndex;

        if (params.id_mes !== undefined) {
            filtro += ` AND j.id_mes = $${valoresBase.length + 1}`;
            mesIndex = valoresBase.length + 1;
            valoresBase.push(params.id_mes);
        };

        if (params.quincena !== undefined) {
            join += ` JOIN quincena q ON j.id_quincena = q.id`;
            joinSon += ` JOIN quincena q2 ON j2.id_quincena = q2.id`;
            filtro += ` AND q.quincena = $${valoresBase.length + 1}`;
            quincenaIndex = valoresBase.length + 1;
            valoresBase.push(params.quincena);
        };

        if (params.id_tipoempleado !== undefined) {
            filtro += ` AND e.id_tipoempleado = $${valoresBase.length + 1}`;
            valoresBase.push(params.id_tipoempleado);
        };

        if (params.ids_proyecto && params.ids_proyecto.length !== 0) {
            let proyectoFiltro = `AND EXISTS (SELECT 1 FROM "jornada" jp`;

            if (params.quincena !== undefined) {
                proyectoFiltro += ` JOIN quincena qp ON jp.id_quincena = qp.id`;
            };

            proyectoFiltro += ` WHERE jp.id_empleado = j.id_empleado AND jp.id_proyecto = ANY($${valoresBase.length + 1})`;

            if (params.id_mes !== undefined) {
                proyectoFiltro += ` AND jp.id_mes = $${mesIndex}`;
            };

            if (params.quincena !== undefined) {
                proyectoFiltro += ` AND qp.quincena = $${quincenaIndex}`;
            };

            proyectoFiltro += `)`;
            filtro += ` ${proyectoFiltro}`;
            valoresBase.push(params.ids_proyecto);
        };

        const sql = `
        WITH jornadas_sumadas AS (
            SELECT
                j.id_empleado,
                e.legajo,
                e.nombre AS empleado,
                SUM(CAST(j.total AS DECIMAL)) AS suma_total,
                SUM(CAST(j.total_normal AS DECIMAL)) AS suma_total_normal,
                SUM(CAST(j.total_50 AS DECIMAL)) AS suma_total_50,
                SUM(CAST(j.total_100 AS DECIMAL)) AS suma_total_100,
                SUM(CAST(j.total_feriado AS DECIMAL)) AS suma_total_feriado,
                SUM(CAST(j.total_nocturno AS DECIMAL)) AS suma_total_nocturno,
                STRING_AGG(DISTINCT p.nombre, ', ' ORDER BY p.nombre) AS proyectos
            FROM "jornada" j
            ${join}
            LEFT JOIN "proyecto" p ON j.id_proyecto = p.id
            ${filtro}
            GROUP BY j.id_empleado, e.legajo, e.nombre
        ),
        ausencias_conteo AS (
            SELECT
                j2.id_empleado,
                ta.id AS id_tipoausencia,
                ta.nombre AS nombre_tipoausencia,
                COUNT(*) AS cantidad
            FROM "jornada" j2
            ${joinSon}
            LEFT JOIN "ausencia" a ON j2.id_ausencia = a.id
            LEFT JOIN "tipoausencia" ta ON a.id_tipoausencia = ta.id
            ${filtro.replace(/\bj\./g, 'j2.').replace(/\bq\./g, 'q2.').replace(/\be\./g, 'e2.')}
            AND j2.id_ausencia IS NOT NULL
            GROUP BY j2.id_empleado, ta.id, ta.nombre
        ),
        observaciones_agrupadas AS (
            SELECT
                j3.id_empleado,
                j3.fecha,
                o.texto
            FROM "jornada" j3
            ${join.replace(/\bj\./g, 'j3.')}
            ${params.quincena !== undefined ? 'JOIN quincena q3 ON j3.id_quincena = q3.id' : ''}
            JOIN "observacion" o ON j3.id = o.id_jornada
            ${filtro.replace(/\bj\./g, 'j3.').replace(/\bq\./g, 'q3.')}
        )
        SELECT
            js.legajo,
            js.empleado,
            js.proyectos,
            js.suma_total,
            js.suma_total_normal,
            js.suma_total_50,
            js.suma_total_100,
            js.suma_total_feriado,
            js.suma_total_nocturno,
            COALESCE(
                json_agg(
                    json_build_object(
                        'id', ac.id_tipoausencia,
                        'nombre', ac.nombre_tipoausencia,
                        'cantidad', ac.cantidad
                    )
                ) FILTER (WHERE ac.id_tipoausencia IS NOT NULL),
                '[]'::json
            ) AS ausencias,
            COALESCE(
                (
                    SELECT json_agg(
                        json_build_object('fecha', oa.fecha, 'texto', oa.texto)
                        ORDER BY oa.fecha DESC
                    )
                    FROM observaciones_agrupadas oa
                    WHERE oa.id_empleado = js.id_empleado
                ),
                '[]'::json
            ) AS observaciones
        FROM jornadas_sumadas js
        LEFT JOIN ausencias_conteo ac ON js.id_empleado = ac.id_empleado
        GROUP BY js.id_empleado, js.legajo, js.empleado, js.proyectos, js.suma_total, js.suma_total_normal,
                js.suma_total_50, js.suma_total_100, js.suma_total_feriado, js.suma_total_nocturno
        ORDER BY js.empleado
    `;

        return this.jornadaRepository.query(sql, valoresBase);
    };

    //Get jornadas by importacion
    async getJornadasByImportacion(params: GetJornadasByImportacionDto): Promise<JornadasImportacionResponseDto> {
        const id_estadojornada = await this.estadoJornadaService.getEstadoJornadaValida();
        const id_tipojornada = await this.tipoJornadaService.getTipoJornadaAusencia();

        const baseQuery = this.jornadaRepository
            .createQueryBuilder('j')
            .innerJoin('j.empleado', 'e')
            .innerJoin('j.estadojornada', 'ej')
            .leftJoin('j.ausencia', 'a')
            .leftJoin('tipoausencia', 'ta', 'a.id_tipoausencia = ta.id')
            .where('j.id_importacion = :id_importacion', { id_importacion: params.id_importacion })
            .andWhere('j.id_estadojornada != :id_estadojornada', { id_estadojornada: id_estadojornada });

        const totalJornadas = await baseQuery
            .clone()
            .select('COUNT(DISTINCT j.id)', 'total')
            .getRawOne()
            .then(r => parseInt(r.total, 10));

        const jornadas = await baseQuery
            .clone()
            .select([
                'j.id AS id',
                'j.fecha AS fecha',
                'j.entrada AS entrada',
                'j.salida AS salida',
                'ej.nombre AS estadojornada',
                'e.nombre AS nombreempleado',
                'ta.id AS id_tipoausencia',
                '(j.id_tipojornada = :id_tipojornada) AS ausencia'
            ])
            .setParameter('id_tipojornada', id_tipojornada)
            .orderBy('ej.nombre', 'ASC')
            .limit(params.limit)
            .offset(params.page * params.limit)
            .getRawMany();

        return {
            jornadas: jornadas.map(jornada => ({
                id: jornada.id,
                fecha: jornada.fecha,
                entrada: jornada.entrada,
                salida: jornada.salida,
                estadojornada: jornada.estadojornada,
                nombreempleado: jornada.nombreempleado,
                id_tipoausencia: jornada.id_tipoausencia,
                ausencia: jornada.ausencia
            })),
            totalJornadas,
        };
    };

    //Get jornada id_ausencia
    async getJornadaAusencia(params: GetJornadaAusenciaDto): Promise<number> {
        const jornada = await this.jornadaRepository.findOne({
            select: { id_ausencia: true },
            where: { id: params.id }
        });

        if (!jornada) {
            throw new NotFoundException(`Jornada with id ${params.id} not found`);
        };

        return jornada.id_ausencia;
    };

    //Get jornada id_ausencia by empleado, fecha
    async getJornadaAusenciaByEmpleado(params: GetJornadaAusenciaByEmpleadoDto): Promise<number> {
        const id_tipojornada = await this.tipoJornadaService.getTipoJornadaAusencia();

        const jornada = await this.jornadaRepository.findOne({
            select: { id_ausencia: true },
            where: { id_empleado: params.id_empleado, fecha: new Date(params.fecha), id_tipojornada: id_tipojornada }
        });

        if (!jornada) {
            throw new NotFoundException(`Jornada not found`);
        };

        return jornada.id_ausencia;
    };

    //Delete jornada
    async deleteJornada(params: DeleteJornadaDto): Promise<void> {
        const result = await this.jornadaRepository.delete({ id: params.id });

        if (result.affected === 0) {
            throw new NotFoundException(`Jornada with id ${params.id} not found`);
        };
    };

    //Edit jornada
    async editJornada(params: EditJornadaDto): Promise<void> {
        const id_fuentemarca = await this.fuenteMarcaService.getFuenteMarcaManual();

        const original = await this.jornadaRepository.findOne({
            where: { id: params.id }
        });

        if (!original) {
            throw new NotFoundException(`Jornada with id ${params.id} not found`);
        };

        if (original.entrada === params.entrada && original.salida === params.salida) {
            await this.jornadaRepository.update(
                {
                    id: params.id
                },
                {
                    entrada: params.entrada,
                    salida: params.salida,
                    id_usuariomodificacion: params.id_usuariomodificacion,
                }
            );
        } else {
            await this.jornadaRepository.update(
                {
                    id: params.id
                },
                {
                    entrada: params.entrada,
                    salida: params.salida,
                    id_usuariomodificacion: params.id_usuariomodificacion,
                    id_fuentemarca: id_fuentemarca
                }
            );
        };
    };

    //Set tipoAusencia jornada ausencia
    async setTipoAusenciaJornadaAusencia(params: EditAusenciaDto): Promise<void> {
        const id_ausencia = await this.getJornadaAusencia({ id: params.id });

        if (!id_ausencia) {
            throw new NotFoundException(`Jornada with id ${params.id} is not an ausencia`)
        };

        await this.ausenciaService.editAusencia({ id: id_ausencia, id_tipoausencia: params.id_tipoausencia });
    };

    //Set estadoJornada valido
    async setEstadoJornadaValida(params: SetEstadoJornadaValidaDto): Promise<void> {
        const id_estadojornada = await this.estadoJornadaService.getEstadoJornadaValida();

        const result = await this.jornadaRepository.update(
            {
                id: params.id
            },
            {
                id_estadojornada: id_estadojornada,
                id_usuariovalidacion: params.id_usuariovalidacion,
                fechavalidacion: new Date()
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Jornada with id ${params.id} not found`);
        };
    };

    //Create jornada
    async createJornada(params: CreateJornadaDto): Promise<number> {
        let jornada = this.jornadaRepository.create({
            fecha: params.fecha,
            entrada: params.entrada,
            salida: params.salida,
            id_empleado: params.id_empleado,
            id_proyecto: params.id_proyecto,
            id_mes: params.id_mes,
            id_quincena: params.id_quincena,
            id_tipojornada: params.id_tipojornada,
            id_ausencia: params.id_ausencia,
            id_estadojornada: params.id_estadojornada,
            id_importacion: params.id_importacion,
            id_fuentemarca: params.id_fuentemarca,
            id_usuariocreacion: params.id_usuariocreacion
        });

        jornada = await this.jornadaRepository.save(jornada);

        return jornada.id;
    };

    //Create jornada manual
    async createJornadaManual(params: CreateJornadaManualDto): Promise<void> {
        const [dia, mes, año] = params.fecha.split('-').map(Number);
        const fecha = `${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const quincena = dia <= 15 ? 1 : 2;

        const id_año = await this.añoService.getAñoByValor({ valor: año });
        const id_mes = await this.mesService.getMesByMesAndAño({ mes, id_año });
        const id_quincena = await this.quincenaService.getQuincenaByQuincenaAndMes({ quincena, id_mes });

        const id_proyecto = await this.empleadoService.getEmpleadoProyecto({ id: params.id_empleado });
        const id_estadojornada = await this.estadoJornadaService.getEstadoJornadaValida();
        const id_fuentemarca = await this.fuenteMarcaService.getFuenteMarcaManual();

        let id_jornada;
        let id_jornadaTarde;

        if (params.id_tipoausencia === undefined) {

            id_jornada = await this.createJornada({
                fecha: fecha,
                entrada: params.entrada,
                salida: params.salida,
                id_empleado: params.id_empleado,
                id_proyecto: id_proyecto,
                id_mes: id_mes,
                id_quincena: id_quincena,
                id_tipojornada: params.id_tipojornada,
                id_estadojornada: id_estadojornada,
                id_fuentemarca: id_fuentemarca,
                id_usuariocreacion: params.id_usuariocreacion
            });

            if (params.entradaTarde !== '' && params.salidaTarde !== '') {

                id_jornadaTarde = await this.createJornada({
                    fecha: fecha,
                    entrada: params.entradaTarde,
                    salida: params.salidaTarde,
                    id_empleado: params.id_empleado,
                    id_proyecto: id_proyecto,
                    id_mes: id_mes,
                    id_quincena: id_quincena,
                    id_tipojornada: params.id_tipojornada,
                    id_estadojornada: id_estadojornada,
                    id_fuentemarca: id_fuentemarca,
                    id_usuariocreacion: params.id_usuariocreacion
                });
            };
        } else {

            const id_ausencia = await this.ausenciaService.createAusencia({
                id_empleado: params.id_empleado,
                id_tipoausencia: params.id_tipoausencia
            });

            id_jornada = await this.createJornada({
                fecha: fecha,
                id_empleado: params.id_empleado,
                id_proyecto: id_proyecto,
                id_mes: id_mes,
                id_quincena: id_quincena,
                id_tipojornada: params.id_tipojornada,
                id_estadojornada: id_estadojornada,
                id_fuentemarca: id_fuentemarca,
                id_usuariocreacion: params.id_usuariocreacion,
                id_ausencia: id_ausencia
            });
        };

        if (params.observacion) {
            await this.observacionService.createObservacion({
                texto: params.observacion,
                id_jornada: id_jornada
            });
        };

        await this.recalculateJornadasEmpleado({
            id_empleado: params.id_empleado
        });
    };

    //Recalcuate values by triggering trigger manually
    async recalculateJornadasEmpleado(params: recalculateJornadasEmpleadoDto): Promise<void> {
        const sql = `
            WITH ordenadas AS (
                SELECT id
                FROM jornada
                WHERE id_empleado = $1
                AND fecha >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '4 weeks')
                ORDER BY fecha ASC
            )
            UPDATE jornada j
            SET entrada = entrada,
                salida = salida
            FROM ordenadas o
            WHERE j.id = o.id
        `;

        await this.jornadaRepository.query(sql, [params.id_empleado]);
    };
};
