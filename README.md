# Bitacora

> Una aplicación full-stack de productividad para tareas, notas y finanzas personales. Construida con React, Node.js, Express, PostgreSQL y Prisma.

## Resumen

Bitacora es una herramienta de productividad minimalista con cuatro módulos principales:

- **Tareas**: Tablero Kanban con arrastrar y soltar, subtareas, prioridades y fechas de vencimiento
- **Notas**: Editor de dos paneles con autoguardado y filtrado por categorías
- **Calendario**: Vista mensual/semanal con eventos de tareas arrastrables
- **Gastos**: Seguimiento de finanzas personales con presupuestos y estadísticas mensuales

## Funcionalidades

### Autenticación

- Autenticación basada en JWT (registro / inicio de sesión / rutas protegidas)
- Token almacenado en localStorage con renovación automática al expirar
- Hash de contraseñas con bcrypt
- Limitación de tasa en los endpoints de autenticación (20 solicitudes / 15 min por IP)

### Tareas

- CRUD completo con estado (`TODO` / `IN_PROGRESS` / `DONE`)
- Arrastrar y soltar entre columnas y dentro de las columnas (dnd-kit)
- Subtareas anidadas con barra de progreso
- Filtros: prioridad, categoría, búsqueda, orden
- Fecha de vencimiento con resaltado de tareas atrasadas
- Etiquetas y categorías

### Notas

- Diseño de dos paneles: lista + editor
- Autoguardado con debounce de 800ms
- Barra lateral de categorías con creación en línea
- Conteo de palabras y marca de tiempo de última edición
- Búsqueda de texto completo

### Calendario

- Integración con FullCalendar (vista mensual / semanal)
- Eventos de tareas coloreados según prioridad
- Arrastrar y soltar para reprogramar
- Clic en fecha vacía para crear una tarea

### Gastos

- Seguimiento mensual de gastos con categorías e íconos
- Límites de presupuesto por categoría con visualización de % usado
- Alertas de sobregasto
- Gráfico de tendencia de gasto de 6 meses
- Creación de categorías por defecto con un solo clic

### UI / UX

- Modo oscuro (persistido en localStorage)
- Diseño responsivo con barra lateral off-canvas en móvil
- Notificaciones toast para todas las mutaciones
- Barra de carga global (React Query `useIsFetching`)
- Estados vacíos y esqueletos de carga

---

## Stack Tecnológico

### Frontend

| Herramienta    | Versión | Propósito                             |
| -------------- | ------- | ------------------------------------- |
| React          | 18      | Framework de UI                       |
| Vite           | 5       | Herramienta de build                  |
| React Router   | 6       | Enrutamiento del lado del cliente     |
| TanStack Query | 5       | Estado del servidor, caché            |
| Zustand        | 5       | Estado del cliente (auth, UI, toasts) |
| Axios          | 1.7     | Cliente HTTP con interceptor JWT      |
| dnd-kit        | 6       | Arrastrar y soltar                    |
| FullCalendar   | 6       | Vista de calendario                   |

### Backend

| Herramienta        | Versión | Propósito                    |
| ------------------ | ------- | ---------------------------- |
| Node.js            | 20 LTS  | Entorno de ejecución         |
| Express            | 4       | Framework HTTP               |
| Prisma             | 5       | ORM + migraciones            |
| PostgreSQL         | 16      | Base de datos                |
| Zod                | 3       | Validación de esquemas       |
| JWT                | 9       | Autenticación                |
| bcryptjs           | 2.4     | Hash de contraseñas          |
| Helmet             | 8       | Cabeceras de seguridad       |
| express-rate-limit | 7       | Limitación de tasa           |
| Morgan             | 1.10    | Registro de solicitudes HTTP |

---

## Arquitectura

```
focus-app/
├── client/    SPA de React (Vite)
└── server/    API REST (Express + Prisma)
```

El cliente y el servidor son completamente independientes. Se comunican exclusivamente mediante HTTP/REST.

### Capas del backend

```
Solicitud → Router → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Router**: define la URL y el método HTTP
- **Controller**: extrae los datos de la solicitud, llama al servicio, envía la respuesta HTTP
- **Service**: lógica de negocio, lanza `ApiError` si es necesario
- **Repository**: solo consultas a la base de datos, sin lógica de negocio

### Capas del frontend

```
Página  →  Hook de Feature  →   Modulo API  →  API de express  →  Store de Zustand
            (React Query)        (axios)                          (estado de UI/auth)
```

---

## Estructura del Proyecto

```
bitacora/
│
├── client/
│   ├── src/
│   │   ├── api/                     # instancia de axios + funciones de API por módulo
│   │   │   ├── axios.js             # instancia base con interceptor JWT
│   │   │   ├── auth.api.js
│   │   │   ├── tasks.api.js
│   │   │   ├── notes.api.js
│   │   │   ├── categories.api.js
│   │   │   └── expenses.api.js
│   │   │
│   │   ├── components/
│   │   │   ├── common/              # Button, Input, Toast, GlobalLoader
│   │   │   └── layout/              # AppLayout, Sidebar
│   │   │
│   │   ├── features/                # carpetas de features orientadas al dominio
│   │   │   ├── auth/
│   │   │   ├── tasks/      # hooks, TaskBoard, TaskCard, TaskDetail, SubtaskList, TaskForm, TaskFilters
│   │   │   ├── notes/               # hooks, NoteCard, NoteEditor
│   │   │   ├── calendar/            # hooks
│   │   │   └── expenses/            # hooks, ExpenseForm
│   │   │
│   │   ├── pages/                   # un archivo por ruta
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   ├── CalendarPage.jsx
│   │   │   └── ExpensesPage.jsx
│   │   │
│   │   ├── router/
│   │   │   ├── AppRouter.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── store/                   # stores de Zustand
│   │   │   ├── useAuthStore.js
│   │   │   ├── useUIStore.js
│   │   │   └── useToastStore.js
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css          # reset + reglas globales
│   │   │   └── variables.css        # tokens de diseño (tema claro + tema oscuro)
│   │   │
│   │   └── main.jsx                 # punto de entrada de la app
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma            # esquema de la base de datos
│   │   └── migrations/              # migraciones
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js              # valida todas las variables de entorno al iniciar
│   │   │
│   │   ├── lib/
│   │   │   └── prisma.js           # instancia única (singleton) de Prisma
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/               # schema · repository · service · controller · routes
│   │   │   ├── tasks/
│   │   │   ├── notes/
│   │   │   ├── categories/
│   │   │   └── expenses/
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js         # clase de error operacional con estado HTTP
│   │   │   └── jwt.js
│   │   │
│   │   └── app.js                  # app de Express
│   │
│   ├── server.js              # punto de entrada del proceso (listen + cierre controlado)
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Requisitos Previos

| Requisito  | Versión                  |
| ---------- | ------------------------ |
| Node.js    | 20 LTS o superior        |
| npm        | 9 o superior             |
| PostgreSQL | 14 o superior (o Docker) |

---

## Primeros Pasos

### 1. Clonar el repositorio

```bash
git clone https://github.com/sofidascanio/bitacora.git
cd bitacora
```

### 2. Configurar la base de datos

**PostgreSQL local:**

```bash
psql -U postgres -c "CREATE DATABASE bitacora_db;"
```

### 3. Configurar el servidor

```bash
cd server
cp .env.example .env
```

Edita `.env` con tus valores

```bash
npm install
npm run prisma:migrate      # crea las tablas
npm run prisma:generate     # genera el cliente de Prisma
npm run dev                 # inicia el servidor en :3001
```

### 4. Configurar el cliente

```bash
cd ../client
cp .env.example .env        # define VITE_API_URL=http://localhost:3001/api
npm install
npm run dev                 # inicia el cliente en :5173
```

### 5. Abrir la app

Navega a [http://localhost:5173](http://localhost:5173) y crea una cuenta.

---

## Variables de Entorno

### `server/.env`

```bash
# Base de datos
DATABASE_URL="postgresql://postgres:password@localhost:5432/bitacora_db"

# Autenticación
JWT_SECRET=""   # openssl rand -base64 32
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3001
NODE_ENV="development"

# CORS
CLIENT_URL="http://localhost:5173"
```

### `client/.env`

```bash
VITE_API_URL="http://localhost:3001/api"
```

---

## Base de Datos

### Resumen del esquema

```
User
 ├── Task (autorreferencial para subtareas)
 │    ├── Category
 │    └── Tag  (muchos a muchos vía TagsOnTasks)
 ├── Note
 │    ├── Category
 │    └── Tag  (muchos a muchos vía TagsOnNotes)
 ├── Category
 ├── ExpenseCategory
 ├── Expense
 └── Budget
```

### Comandos útiles

```bash
# Crear una nueva migración
npm run prisma:migrate

# Abrir Prisma Studio
npm run prisma:studio

# Regenerar el cliente de Prisma
npm run prisma:generate
```

---

## Referencia de la API

Todos los endpoints requieren `Authorization: Bearer <token>`, excepto las rutas de autenticación.

### Autenticación

| Método | Ruta                 | Cuerpo                        | Descripción                  |
| ------ | -------------------- | ----------------------------- | ---------------------------- |
| `POST` | `/api/auth/register` | `{username, email, password}` | Crear cuenta                 |
| `POST` | `/api/auth/login`    | `{email, password}`           | Iniciar sesión, devuelve JWT |
| `GET`  | `/api/auth/me`       | —                             | Obtener usuario actual       |

### Tareas

| Método   | Ruta                   | Descripción                                       |
| -------- | ---------------------- | ------------------------------------------------- |
| `GET`    | `/api/tasks`           | Listar tareas (permite filtros)                   |
| `GET`    | `/api/tasks/calendar`  | Tareas con dueDate en un rango (`?from=&to=`)     |
| `GET`    | `/api/tasks/:id`       | Detalle de tarea con subtareas                    |
| `POST`   | `/api/tasks`           | Crear tarea                                       |
| `PATCH`  | `/api/tasks/:id`       | Actualizar tarea                                  |
| `DELETE` | `/api/tasks/:id`       | Eliminar tarea (elimina en cascada las subtareas) |
| `PATCH`  | `/api/tasks/:id/order` | Actualizar posición de arrastrar y soltar         |

**Filtros de consulta para `GET /api/tasks`:**

| Parámetro    | Tipo                                  | Por defecto | Descripción                                        |
| ------------ | ------------------------------------- | ----------- | -------------------------------------------------- |
| `status`     | `TODO\|IN_PROGRESS\|DONE`             | —           | Filtrar por estado                                 |
| `priority`   | `LOW\|MEDIUM\|HIGH`                   | —           | Filtrar por prioridad                              |
| `categoryId` | cuid                                  | —           | Filtrar por categoría                              |
| `search`     | string                                | —           | Búsqueda de texto completo en título y descripción |
| `page`       | number                                | `1`         | Paginación                                         |
| `limit`      | number                                | `20`        | Resultados por página (máx. 100)                   |
| `sortBy`     | `createdAt\|dueDate\|priority\|order` | `createdAt` | Campo de orden                                     |
| `sortOrder`  | `asc\|desc`                           | `desc`      | Dirección del orden                                |

### Notas

| Método   | Ruta             | Descripción                                                                                       |
| -------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/notes`     | Listar notas (permite filtrar por `search`, `categoryId`, `page`, `limit`, `sortBy`, `sortOrder`) |
| `GET`    | `/api/notes/:id` | Detalle de nota                                                                                   |
| `POST`   | `/api/notes`     | Crear nota                                                                                        |
| `PATCH`  | `/api/notes/:id` | Actualizar nota                                                                                   |
| `DELETE` | `/api/notes/:id` | Eliminar nota                                                                                     |

### Categorías

| Método   | Ruta                  | Descripción                   |
| -------- | --------------------- | ----------------------------- |
| `GET`    | `/api/categories`     | Listar categorías del usuario |
| `POST`   | `/api/categories`     | Crear categoría               |
| `PATCH`  | `/api/categories/:id` | Actualizar categoría          |
| `DELETE` | `/api/categories/:id` | Eliminar categoría            |

### Gastos

| Método   | Ruta                           | Descripción                                                                                  |
| -------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `GET`    | `/api/expenses`                | Listar gastos (permite filtrar por `month`, `year`, `categoryId`, `search`, `page`, `limit`) |
| `GET`    | `/api/expenses/stats`          | Estadísticas mensuales + tendencia de 6 meses (`?month=&year=`)                              |
| `GET`    | `/api/expenses/:id`            | Detalle de gasto                                                                             |
| `POST`   | `/api/expenses`                | Crear gasto                                                                                  |
| `PATCH`  | `/api/expenses/:id`            | Actualizar gasto                                                                             |
| `DELETE` | `/api/expenses/:id`            | Eliminar gasto                                                                               |
| `GET`    | `/api/expenses/categories`     | Listar categorías de gastos                                                                  |
| `POST`   | `/api/expenses/categories`     | Crear categoría de gasto                                                                     |
| `PATCH`  | `/api/expenses/categories/:id` | Actualizar categoría                                                                         |
| `DELETE` | `/api/expenses/categories/:id` | Eliminar categoría                                                                           |
| `GET`    | `/api/expenses/budgets`        | Obtener presupuestos (`?month=&year=`)                                                       |
| `POST`   | `/api/expenses/budgets`        | Crear o actualizar presupuesto                                                               |
| `DELETE` | `/api/expenses/budgets/:id`    | Eliminar presupuesto                                                                         |

### Formato de errores

Todos los errores siguen esta estructura:

```json
{
  "message": "Validation error",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

Códigos de estado HTTP utilizados: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `429`, `500`.

---
