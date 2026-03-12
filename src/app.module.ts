import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './common/strategies/jwt.strategy';
//modules
import { ModalidadValidacionModule } from './modules/core/modalidadvalidacion/modalidadvalidacion.module';
import { TipoUsuarioModule } from './modules/core/tipousuario/tipousuario.module';
import { TipoJornadaModule } from './modules/core/tipojornada/tipojornada.module';
import { TipoImportacionModule } from './modules/core/tipoimportacion/tipoimportacion.module';
import { TipoEmpleadoModule } from './modules/core/tipoempleado/tipoempleado.module';
import { TipoAusenciaModule } from './modules/core/tipoausencia/tipoausencia.module';
import { EstadoParametroModule } from './modules/core/estadoparametro/estadoparametro.module';
import { QuincenaModule } from './modules/core/quincena/quincena.module';
import { MesModule } from './modules/core/mes/mes.module';
import { AñoModule } from './modules/core/año/año.module';
import { ProyectoModule } from './modules/core/proyecto/proyecto.module';
import { ModalidadTrabajoModule } from './modules/core/modalidadtrabajo/modalidadtrabajo.module';
import { ObservacionModule } from './modules/core/observacion/observacion.module';
import { FuenteMarcaModule } from './modules/core/fuentemarca/fuentemarca.module';
import { EstadoUsuarioModule } from './modules/core/estadousuario/estadousuario.module';
import { EstadoJornadaModule } from './modules/core/estadojornada/estadojornada.module';
import { EstadoImportacionModule } from './modules/core/estadoimportacion/estadoimportacion.module';
import { EstadoEmpleadoModule } from './modules/core/estadoempleado/estadoempleado.module';
import { ControlModule } from './modules/core/control/control.module';
import { AusenciaModule } from './modules/core/ausencia/ausencia.module';
import { ImportacionModule } from './modules/core/importacion/importacion.module';
import { UsuarioModule } from './modules/core/usuario/usuario.module';
import { EmpleadoModule } from './modules/core/empleado/empleado.module';
import { NominaModule } from './modules/mssql/nomina/nomina.module';
import { SyncEmpleadosModule } from './modules/features/syncempleados/syncempleados.module';
import { RegistrosAccesoModule } from './modules/mssql/registros_acceso/registros_acceso.module';
import { AsistenciaModule } from './modules/features/asistencia/asistencia.module';
import { JornadaModule } from './modules/core/jornada/jornada.module';
import { ImportarModule } from './modules/features/importar/importar.module';
import { ExcelModule } from './modules/features/excel/excel.module';
import { ExportarModule } from './modules/features/exportar/exportar.module';

@Module({
  imports: [
    //.env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    //database
    TypeOrmModule.forRootAsync({
      name: 'default',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PSQL_DB_HOST'),
        port: configService.get('PSQL_DB_PORT'),
        username: configService.get('PSQL_DB_USERNAME'),
        password: configService.get('PSQL_DB_PASSWORD'),
        database: configService.get('PSQL_DB_DATABASE'),
        entities: [__dirname + '/modules/core/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
      })
    }),
    TypeOrmModule.forRootAsync({
      name: 'mssql',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get('MSSQL_DB_HOST'),
        port: parseInt(configService.get('MSSQL_DB_PORT') || '1433', 10),
        username: configService.get('MSSQL_DB_USERNAME'),
        password: configService.get('MSSQL_DB_PASSWORD'),
        database: configService.get('MSSQL_DB_DATABASE'),
        entities: [__dirname + '/modules/mssql/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: false,
        options: {
          encrypt: true,
          trustServerCertificate: true,
        },
      })
    }),

    //auth
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '24h',
        },
      }),
    }),

    //modules
    ModalidadValidacionModule,
    TipoUsuarioModule,
    TipoJornadaModule,
    TipoImportacionModule,
    TipoEmpleadoModule,
    TipoAusenciaModule,
    EstadoParametroModule,
    QuincenaModule,
    MesModule,
    AñoModule,
    ProyectoModule,
    ModalidadTrabajoModule,
    ObservacionModule,
    FuenteMarcaModule,
    EstadoUsuarioModule,
    EstadoJornadaModule,
    EstadoImportacionModule,
    EstadoEmpleadoModule,
    ControlModule,
    AusenciaModule,
    ImportacionModule,
    UsuarioModule,
    EmpleadoModule,
    NominaModule,
    SyncEmpleadosModule,
    RegistrosAccesoModule,
    AsistenciaModule,
    JornadaModule,
    ImportarModule,
    ExcelModule,
    ExportarModule

  ],
  providers: [
    JwtStrategy
  ],
})
export class AppModule { }
