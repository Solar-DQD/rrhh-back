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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

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
    TipoJornadaModule

  ],
  providers: [
    JwtStrategy
  ],
})
export class AppModule {}
