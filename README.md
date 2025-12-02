# Microservicios-Springboot + Frontend React

Proyecto completo que integra:

- **Backend** (carpeta `microservicio_backend/`)
  - Arquitectura de microservicios con Spring Boot + Spring Cloud.
  - Servicios: `eureka-server`, `api-gateway`, `categoria-service`, `producto-service`.
- **Frontend** (carpeta `frontend/`)
  - Aplicación SPA en React + Vite para gestionar categorías y productos.

Este README explica cómo **configurar** y **levantar** todo el sistema (backend + frontend).

---

## 1. Estructura del repositorio

```text
Microservicios-Springboot/
├── microservicio_backend/   # Backend: microservicios en Spring Boot
└── frontend/                # Frontend: React + Vite
```

- Detalle del backend: ver `microservicio_backend/README.md`.
- Detalle del frontend: ver `frontend/README.md`.

---

## 2. Requisitos previos

- **Git**
- **Java 17**
- **Maven 3.8+**
- **MySQL 8+** (o compatible) ejecutándose en `localhost:3306`
- **Node.js 16+** (recomendado 18+) y **npm**

---

## 3. Configuración de base de datos (MySQL)

El backend utiliza **dos bases de datos independientes**:

- Base de datos de categorías: `db_categoria`
- Base de datos de productos: `db_producto`

Crea ambas BDs en MySQL (las tablas se crean automáticamente al iniciar los microservicios gracias a `spring.jpa.hibernate.ddl-auto=update`):

```sql
CREATE DATABASE db_categoria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE db_producto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Si usas un usuario, contraseña o puerto distintos, actualiza las propiedades `spring.datasource.*` en:

- `microservicio_backend/categoria-service/src/main/resources/application.properties`
- `microservicio_backend/producto-service/src/main/resources/application.properties`

---

## 5. Levantar el backend (microservicios)

Desde la carpeta raíz del repo:

```bash
cd microservicio_backend
```

### 5.1. Orden recomendado de arranque

1. **Eureka Server** (`eureka-server`)
   - Puerto: `8761`
   - Comandos (desde `microservicio_backend/eureka-server`):
     ```bash
     mvn spring-boot:run
     ```
   - Verifica en `http://localhost:8761/` que el servidor Eureka esté arriba.

2. **Categoria Service** (`categoria-service`)
   - Puerto: `8081`
   - Conecta a la BD `db_categoria`.
   - Comandos (desde `microservicio_backend/categoria-service`):
     ```bash
     mvn spring-boot:run
     ```

3. **Producto Service** (`producto-service`)
   - Puerto: `8082`
   - Conecta a la BD `db_producto`.
   - Comandos (desde `microservicio_backend/producto-service`):
     ```bash
     mvn spring-boot:run
     ```

4. **API Gateway** (`api-gateway`)
   - Puerto: `8083`
   - Actualmente enruta:
     - `/api/categorias/**` → `http://localhost:8081`
     - `/api/productos/**`  → `http://localhost:8082`
   - Comandos (desde `microservicio_backend/api-gateway`):
     ```bash
     mvn spring-boot:run
     ```

> También puedes generar los `.jar` con `mvn clean package` en cada módulo y ejecutarlos con `java -jar ...`.

---

## 6. Levantar el frontend (React + Vite)

Desde la raíz del repo:

```bash
cd frontend
```

### 6.1. Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias declaradas en `frontend/package.json` (React, React Router, Axios, Tailwind, Framer Motion, etc.).

### 6.2. Ejecutar en modo desarrollo

```bash
npm run dev
```

- La aplicación se levantará normalmente en `http://localhost:5173`.
- Asegúrate de que los microservicios de backend estén ya levantados.

### 6.3. Comunicación frontend ↔ backend

Actualmente el frontend se comunica **directamente** con los microservicios (sin pasar por el API Gateway):

- Categorías: `http://localhost:8081/api`
- Productos: `http://localhost:8082/api`

Endpoints (relativos a esas URLs base):

- Categorías:
  - `GET /categorias`
  - `POST /categorias`
  - `PUT /categorias/:id`
  - `DELETE /categorias/:id`
- Productos:
  - `GET /productos`
  - `POST /productos`
  - `PUT /productos/:id`
  - `DELETE /productos/:id`

> Si más adelante decides que el frontend consuma el **API Gateway** en lugar de los microservicios directos, deberás actualizar `frontend/src/services/api.js` y la documentación correspondiente para apuntar a `http://localhost:8083/api`.

---

## 7. Resumen de puertos

- `8761` → Eureka Server (`eureka-server`)
- `8081` → Categoria Service (`categoria-service`)
- `8082` → Producto Service (`producto-service`)
- `8083` → API Gateway (`api-gateway`)
- `5173` → Frontend React (Vite dev server)

---

## 8. Flujo general del sistema

1. El usuario accede al **frontend** en `http://localhost:5173`.
2. El frontend hace peticiones HTTP a los microservicios:
   - Categorías → `http://localhost:8081/api/categorias/...`
   - Productos → `http://localhost:8082/api/productos/...`
3. Cada microservicio persiste los datos en su propia base de datos (`db_categoria` o `db_producto`).
4. Los microservicios se registran en **Eureka** (`http://localhost:8761/`), lo que permite eventualmente usar el **API Gateway** para centralizar las peticiones.

---

## 9. Documentación adicional

- Detalle del backend (configuración, puertos, BDs, orden de arranque):
  - `microservicio_backend/README.md`
- Detalle del frontend (estructura de carpetas, componentes, páginas, build, etc.):
  - `frontend/README.md`

Con estos pasos, cualquier persona debería poder levantar **todos los microservicios** y el **frontend** sin inconvenientes.
