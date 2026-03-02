import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Not, Repository } from 'typeorm';
import { EmpleadosResponseDto, GetEmpleadosDto } from './dto/get-empleado.dto';
import { TipoEmpleadoService } from '../tipoempleado/tipoempleado.service';
import { GetEmpleadoByDniDto } from './dto/get-empleado-dni.dto';
import { GetEmpleadoProyectoDto } from './dto/get-empleado-proyecto.dto';
import { ModalidadValidacionService } from '../modalidadvalidacion/modalidadvalidacion.service';
import { EmpleadosAsistenciaResponseDto } from './dto/get-empleado-asistencia.dto';
import { DeactivateEmpleadoDto } from './dto/deactivate-empleado.dto';
import { EstadoEmpleadoService } from '../estadoempleado/estadoempleado.service';
import { EditEmpleadoDto, EditEmpleadoSyncDto } from './dto/edit-empleado.dto';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';

@Injectable()
export class EmpleadoService {
    constructor(
        @InjectRepository(Empleado)
        private empleadoRepository: Repository<Empleado>,
        private tipoEmpleadoService: TipoEmpleadoService,
        private modalidadValidacionService: ModalidadValidacionService,
        private estadoEmpleadoService: EstadoEmpleadoService
    ) { }

    //Get empleados
    async getEmpleados(params: GetEmpleadosDto): Promise<EmpleadosResponseDto> {
        const upperCaseDirection = params.direction.toUpperCase() as 'ASC' | 'DESC';

        const id_tipoempleado = await this.tipoEmpleadoService.getTipoEmpleadoMensual();

        const baseQuery = this.empleadoRepository
            .createQueryBuilder('e')
            .innerJoin('e.proyecto', 'p')
            .innerJoin('e.estadoempleado', 'ee')
            .leftJoin('e.modalidadvalidacion', 'mv')
            .leftJoin('e.tipoempleado', 'te')

        if (params.id_tipoempleado !== 0) {
            baseQuery.andWhere('e.id_tipoempleado = :id_tipoempleado', { id_tipoempleado: params.id_tipoempleado });
        };

        if (params.id_tipoausencia !== -1) {
            baseQuery.innerJoin('jornada', 'ja', 'ja.id_empleado = e.id')
                .andWhere('ja.id_ausencia IS NOT NULL');

            if (params.id_tipoausencia !== 0) {
                baseQuery.innerJoin('ausencia', 'a', 'ja.id_ausencia = a.id')
                    .andWhere('a.id_tipoausencia = :id_tipoausencia', { id_tipoausencia: params.id_tipoausencia });
            };

            if (params.id_mes !== 0) {
                baseQuery.andWhere('ja.id_mes = :id_mes', { id_mes: params.id_mes });
            };

            if (params.quincena !== 0) {
                baseQuery.innerJoin('quincena', 'q', 'ja.id_quincena = q.id')
                    .andWhere('q.quincena = :quincena', { quincena: params.quincena });
            };
        };

        if (params.id_proyecto !== 0) {
            baseQuery.andWhere('e.id_proyecto = :id_proyecto', { id_proyecto: params.id_proyecto });
        };

        if (params.nombre !== '') {
            baseQuery.andWhere('unaccent(e.nombre) ILIKE unaccent(:nombre)', { nombre: `%${params.nombre}%` });
        };

        if (params.legajo !== 0) {
            baseQuery.andWhere('CAST(e.legajo AS TEXT) LIKE :legajo', { legajo: `%${params.legajo}%` });
        }

        if (params.manual === true) {
            baseQuery.innerJoin('jornada', 'jm', 'jm.id_empleado = e.id')
                .innerJoin('fuentemarca', 'fm', 'jm.id_fuentemarca = fm.id')
                .andWhere('fm.nombre = :fuentemarca', { fuentemarca: 'Manual' });
        };

        const totalEmpleados = await baseQuery
            .clone()
            .select('COUNT(DISTINCT e.id)', 'total')
            .getRawOne()
            .then(r => parseInt(r.total, 10));

        const empleados = await baseQuery
            .clone()
            .select([
                'e.id AS id',
                'e.nombre AS nombre',
                'e.dni AS dni',
                'e.legajo AS legajo',
                'e.id_proyecto AS id_proyecto',
                'e.id_estadoempleado AS id_estadoempleado',
                'e.id_tipoempleado AS id_tipoempleado',
                'e.id_modalidadvalidacion AS id_modalidadvalidacion',
                'p.nombre AS nombreproyecto',
                'ee.nombre AS estadoempleado',
                'te.nombre AS tipoempleado',
                'mv.nombre AS modalidadvalidacion',
                'COALESCE((te.id = :id_tipoempleadomensual), false) AS es_mensualizado',
            ])
            .setParameter('id_tipoempleadomensual', id_tipoempleado)
            .groupBy('e.id')
            .addGroupBy('p.id')
            .addGroupBy('mv.id')
            .addGroupBy('ee.id')
            .addGroupBy('te.id')
            .orderBy(params.column, upperCaseDirection)
            .limit(params.limit)
            .offset(params.page * params.limit)
            .getRawMany();

        return {
            empleados: empleados.map(empleado => ({
                id: empleado.id,
                nombre: empleado.nombre,
                dni: empleado.dni,
                legajo: empleado.legajo,
                id_proyecto: empleado.id_proyecto,
                id_estadoempleado: empleado.id_estadoempleado,
                id_tipoempleado: empleado.id_tipoempleado,
                id_modalidadvalidacion: empleado.id_modalidadvalidacion,
                nombreproyecto: empleado.nombreproyecto,
                estadoempleado: empleado.estadoempleado,
                tipoempleado: empleado.tipoempleado,
                modalidadvalidacion: empleado.modalidadvalidacion,
                es_mensualizado: empleado.es_mensualizado,
            })),
            totalEmpleados
        };
    };

    //Get empleado by dni
    async getEmpleadoByDni(params: GetEmpleadoByDniDto): Promise<number | null> {
        const empleado = await this.empleadoRepository.findOne({
            select: { id: true },
            where: { dni: params.dni }
        });

        if (!empleado) {
            return null;
        };

        return empleado.id;
    };

    //Get empleado proyecto
    async getEmpleadoProyecto(params: GetEmpleadoProyectoDto): Promise<number> {
        const empleado = await this.empleadoRepository.findOne({
            select: { id_proyecto: true },
            where: { id: params.id }
        });

        if (!empleado) {
            throw new NotFoundException(`Empleado with id ${params.id} not found`);
        };

        return empleado.id_proyecto;
    };

    //Get empleados modalidadValidacion manual
    async getEmpleadosModalidadValidacionManual(): Promise<string[]> {
        const id_modalidadvalidacion = await this.modalidadValidacionService.getModalidadValidacionManual();

        const empleados = await this.empleadoRepository.find({
            select: { dni: true },
            where: { id_modalidadvalidacion: id_modalidadvalidacion }
        });

        return empleados.map(empleado => String(empleado.dni));
    };

    //Get all
    async getAllEmpleados(): Promise<Empleado[]> {
        const empleados = await this.empleadoRepository
            .createQueryBuilder('e')
            .select(['e.id', 'e.dni', 'e.id_modalidadvalidacion'])
            .distinct(true)
            .getMany();

        return empleados;
    };

    //Get empleados used in asistencia count
    async getEmpleadosAsistencia(): Promise<EmpleadosAsistenciaResponseDto> {
        const empleados = await this.empleadoRepository
            .createQueryBuilder('e')
            .select(['e.id', 'e.nombre', 'e.dni', 'e.id_tipoempleado', 'te.nombre'])
            .distinct(true)
            .leftJoin('e.tipoempleado', 'te')
            .leftJoin('jornada', 'j', 'j.id_empleado = e.id')
            .getMany()

        return {
            empleados: empleados.map(empleado => ({
                id: empleado.id,
                nombre: empleado.nombre,
                dni: empleado.dni,
                id_tipoempleado: empleado.id_tipoempleado,
                tipoempleado: empleado.tipoempleado?.nombre
            }))
        };
    };

    //Deactivate empleado
    async deactivateEmpleado(params: DeactivateEmpleadoDto): Promise<void> {
        const id_estadoempleado = await this.estadoEmpleadoService.getEstadoEmpleadoBaja();

        const result = await this.empleadoRepository.update(
            {
                id: params.id,
                id_estadoempleado: Not(id_estadoempleado)
            },
            {
                id_estadoempleado: id_estadoempleado
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Empleado with id ${params.id} not found or already deactivated`);
        };
    };

    //Edit empleado
    async editEmpleado(params: EditEmpleadoDto): Promise<void> {
        const id_estadoempleado = await this.estadoEmpleadoService.getEstadoEmpleadoBaja();

        const result = await this.empleadoRepository.update(
            {
                id: params.id,
                id_estadoempleado: Not(id_estadoempleado)
            },
            {
                id_modalidadvalidacion: params.id_modalidadvalidacion
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Empleado with id ${params.id} not found or cannot be edited`);
        };
    };

    //Edit empleado used in sync nomina
    async editEmpleadoSync(params: EditEmpleadoSyncDto): Promise<void> {
        const result = await this.empleadoRepository.update(
            {
                id: params.id
            },
            {
                legajo: params.legajo,
                nombre: params.nombre,
                id_proyecto: params.id_proyecto,
                id_tipoempleado: params.id_tipoempleado,
                id_estadoempleado: params.id_estadoempleado,
                id_modalidadvalidacion: params.id_modalidadvalidacion,
            }
        );

        if (result.affected === 0) {
            throw new NotFoundException(`Empleado with id ${params.id} not found or cannot be edited`);
        };
    };

    //Create empleado
    async createEmpleado(params: CreateEmpleadoDto): Promise<number> {
        const id_estadoempleado = await this.estadoEmpleadoService.getEstadoEmpleadoActivo();
        const id_modalidadvalidacion = await this.modalidadValidacionService.getModalidadValidacionAutomatica();

        let empleado = await this.empleadoRepository.create({
            nombre: params.nombre,
            dni: params.dni,
            legajo: params.legajo,
            id_proyecto: params.id_proyecto,
            id_tipoempleado: params.id_tipoempleado,
            id_estadoempleado,
            id_modalidadvalidacion
        });

        empleado = await this.empleadoRepository.save(empleado);

        return empleado.id;
    };
};
