# RRHH Backend DQD

API backend para gestión de recursos humanos y sincronización con sistemas MSSQL.

## Descripción

Aplicación backend construida con NestJS 11 que expone servicios para controlar empleados, ausencias, jornadas, importaciones, nómina, sincronización de empleados y registros de acceso. Utiliza TypeORM con dos conexiones de base de datos: PostgreSQL para los datos de la aplicación y SQL Server para integración con sistemas de nómina y acceso.

## Stack

- Node.js 20+
- NestJS 11
- TypeScript
- TypeORM
- PostgreSQL
- SQL Server (MSSQL)
- JWT / Passport para autenticación
- ExcelJS para exportación/importación de hojas de cálculo
- Multer para manejo de archivos

## Requisitos

- Node.js 20+ instalado
- PostgreSQL accesible para la base de datos principal
- SQL Server accesible para la conexión MSSQL
- Archivo de variables de entorno `.env` configurado en la raíz

## Setup

```bash
npm install
```

Duplicar y completar el archivo `.env` con las credenciales reales.

```bash
# compilar generación de cliente si corresponde
npm run build
```

> Este repositorio no incluye un `.env.example`, por lo que debes crear el archivo manualmente.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PSQL_DB_HOST` | Host de PostgreSQL |
| `PSQL_DB_PORT` | Puerto de PostgreSQL |
| `PSQL_DB_USERNAME` | Usuario de PostgreSQL |
| `PSQL_DB_PASSWORD` | Contraseña de PostgreSQL |
| `PSQL_DB_DATABASE` | Base de datos PostgreSQL |
| `MSSQL_DB_HOST` | Host de SQL Server |
| `MSSQL_DB_PORT` | Puerto de SQL Server |
| `MSSQL_DB_USERNAME` | Usuario de SQL Server |
| `MSSQL_DB_PASSWORD` | Contraseña de SQL Server |
| `MSSQL_DB_DATABASE` | Base de datos SQL Server |
| `JWT_SECRET` | Clave secreta JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración de JWT (por ejemplo `24h`) |

## Scripts

| Script | Descripción |
|---|---|
| `npm run start` | Iniciar la aplicación en modo producción |
| `npm run start:dev` | Iniciar en modo desarrollo con watch |
| `npm run start:debug` | Iniciar en modo debug |
| `npm run start:prod` | Ejecutar la aplicación compilada |
| `npm run build` | Compilar el proyecto NestJS |
| `npm run lint` | Ejecutar ESLint y aplicar correcciones |
| `npm run test` | Ejecutar tests unitarios |
| `npm run test:e2e` | Ejecutar e2e tests |
| `npm run test:cov` | Ejecutar tests y generar cobertura |

## Endpoints principales

### Autenticación / usuario

- `GET /usuario/login?correo=<email>` — buscar usuario por correo (público)
- `GET /usuario` — obtener lista de usuarios
- `POST /usuario` — crear usuario
- `PATCH /usuario/:id` — editar usuario
- `DELETE /usuario/:id` — desactivar usuario

### Empleados

- `GET /empleado` — listar empleados
- `POST /empleado` — crear empleado
- `PATCH /empleado/:id` — editar empleado
- `DELETE /empleado/:id` — desactivar empleado
- `GET /empleado/:id/observacion` — obtener observaciones de un empleado
- `GET /empleado/:id/jornada` — obtener jornadas de un empleado
- `GET /empleado/:id/resumen` — obtener resumen de jornada por empleado

### Proyectos

- `GET /proyecto` — listar proyectos
- `GET /proyecto/paginated` — listar proyectos paginados
- `GET /proyecto/:id` — obtener proyecto por ID (público)
- `POST /proyecto` — crear proyecto
- `PATCH /proyecto/:id` — editar proyecto
- `DELETE /proyecto/:id` — desactivar proyecto

### Importaciones

- `GET /importacion` — listar importaciones
- `GET /importacion/count` — contar importaciones por proyecto del usuario
- `PATCH /importacion/:id` — marcar importación como completa
- `DELETE /importacion/:id` — eliminar importación
- `GET /importacion/:id/jornada` — jornadas asociadas a una importación

### Sincronización y procesos

- `POST /sync` — sincronizar empleados con nómina
- `POST /cron/import` — ejecutar importación manual de cron

### Importación de datos externos

- `POST /importar/hikvision` — importar jornadas desde Hikvision
- `POST /importar/prosoft` — importar archivo ProSoft (multipart/form-data)

### Exportación de reportes

- `GET /exportar/asistencia` — exportar asistencia en Excel
- `GET /exportar/resumen` — exportar resumen en Excel

### Asistencia

- `GET /asistencia` — obtener asistencia de proyecto
- `GET /asistencia/inicio` — obtener asistencia inicial por usuario

### Catálogos y datos estáticos

- `GET /tipoempleado`
- `GET /tipoausencia`
- `GET /tipojornada`
- `GET /tipousuario`
- `GET /modalidadtrabajo`
- `GET /modalidadvalidacion`
- `GET /tipoimportacion`
- `GET /mes`

### Observaciones

- `DELETE /observacion/:id` — eliminar observación

## Arquitectura y módulos

El servidor está organizado con módulos NestJS en `src/modules` y proveedores compartidos en `src/common`.

Principales áreas funcionales:

- `core`:
  - `empleado`, `usuario`, `ausencia`, `jornada`, `control`, `importacion`, `proyecto`, `quincena`, `mes`, `año`
  - catálogos como `tipoempleado`, `tipoausencia`, `tipojornada`, `tipousuario`, `modalidadtrabajo`, `modalidadvalidacion`
  - estados como `estadoempleado`, `estadojornada`, `estadousuario`, `estadoimportacion`, `estadoparametro`
- `features`:
  - `asistencia`, `cron`, `excel`, `exportar`, `importar`, `syncempleados`
- `mssql`:
  - integración con `nomina` y `registros_acceso`

## Estructura principal

```text
src/
  app.module.ts
  main.ts
  common/
    decorators/
    filters/
    guards/
    interceptors/
    strategies/
  modules/
    core/
    features/
    mssql/
test/
  app.e2e-spec.ts
  jest-e2e.json
```

## Notas

- La configuración de TypeORM se carga desde `.env` usando `@nestjs/config`.
- Hay dos conexiones TypeORM: `default` (PostgreSQL) y `mssql` (SQL Server).
- La autenticación JWT se configura con `passport-jwt` y `JwtStrategy`.