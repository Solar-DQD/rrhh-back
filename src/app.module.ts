import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './common/strategies/jwt.strategy';
//modules
import { TurnoModule } from './modules/turno/turno.module';
import { TipoUsuarioModule } from './modules/tipousuario/tipousuario.module';
import { TipoJornadaModule } from './modules/tipojornada/tipojornada.module';
import { TipoImportacionModule } from './modules/tipoimportacion/tipoimportacion.module';
import { TipoEmpleadoModule } from './modules/tipoempleado/tipoempleado.module';
import { TipoAusenciaModule } from './modules/tipoausencia/tipoausencia.module';
import { EstadoParametroModule } from './modules/estadoparametro/estadoparametro.module';
import { QuincenaModule } from './modules/quincena/quincena.module';
import { MesModule } from './modules/mes/mes.module';
import { AñoModule } from './modules/año/año.module';
import { ProyectoModule } from './modules/proyecto/proyecto.module';
import { ModalidadTrabajoModule } from './modules/modalidadtrabajo/modalidadtrabajo.module';
import { ObservacionModule } from './modules/observacion/observacion.module';
import { FuenteMarcaModule } from './modules/fuentemarca/fuentemarca.module';
import { EstadoUsuarioModule } from './modules/estadousuario/estadousuario.module';
import { EstadoJornadaModule } from './modules/estadojornada/estadojornada.module';
import { EstadoImportacionModule } from './modules/estadoimportacion/estadoimportacion.module';
import { EstadoEmpleadoModule } from './modules/estadoempleado/estadoempleado.module';
import { ControlModule } from './modules/control/control.module';
import { AusenciaModule } from './modules/ausencia/ausencia.module';
import { ImportacionModule } from './modules/importacion/importacion.module';

@Module({
  imports: [
    //.env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    //database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PSQL_DB_HOST'),
        port: configService.get('PSQL_DB_PORT'),
        username: configService.get('PSQL_DB_USERNAME'),
        password: configService.get('PSQL_DB_PASSWORD'),
        database: configService.get('PSQL_DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: configService.get('NODE_ENV') === 'development',
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
    TurnoModule,
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
    ImportacionModule

  ],
  providers: [
    JwtStrategy
  ],
})
export class AppModule {}
