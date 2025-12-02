# Microservicios-Springboot + Frontend React

Proyecto completo que integra:

- **Backend** (carpeta `microservicio_backend/`)
  - Arquitectura de microservicios con Spring Boot + Spring Cloud.
  - Servicios: `eureka-server`, `api-gateway`, `categoria-service`, `producto-service`.
- **Frontend** (carpeta `frontend/`)
  - Aplicación SPA en React + Vite para gestionar categorías y productos.

Este README explica cómo **configurar** y **levantar** todo el sistema (backend + frontend).

---

## 📋 Funcionalidades

### Gestión de Categorías
- ✅ **Listar categorías**: Visualización de todas las categorías disponibles
- ✅ **Crear categoría**: Agregar nuevas categorías con validación
- ✅ **Editar categoría**: Modificar información de categorías existentes
- ✅ **Eliminar categoría**: Eliminar categorías con confirmación
- ✅ **Búsqueda en tiempo real**: Filtrar categorías por nombre

### Gestión de Productos
- ✅ **Listar productos**: Visualización en tabla interactiva con información completa
- ✅ **Crear producto**: Agregar nuevos productos con nombre, precio, stock y categoría
- ✅ **Editar producto**: Modificar información de productos existentes
- ✅ **Eliminar producto**: Eliminar productos con confirmación
- ✅ **Búsqueda en tiempo real**: Filtrar productos por nombre
- ✅ **Visualización de stock**: Indicadores visuales de stock (alto, medio, bajo)
- ✅ **Asociación con categorías**: Cada producto está vinculado a una categoría

### Características de la Interfaz
- 🎨 **Diseño moderno**: Interfaz responsiva con Tailwind CSS
- ✨ **Animaciones suaves**: Transiciones elegantes con Framer Motion
- 📱 **Responsive**: Adaptado para desktop, tablet y móvil
- 🔔 **Notificaciones**: Toast notifications para feedback de acciones
- ⚡ **Rendimiento optimizado**: Carga rápida con Vite
- 🎯 **UX intuitiva**: Navegación clara y componentes reutilizables

### Arquitectura de Microservicios
- 🔄 **Service Discovery**: Eureka Server para registro de servicios
- 🚪 **API Gateway**: Punto de entrada centralizado para las APIs
- 🗄️ **Bases de datos independientes**: Separación de datos por servicio
- 🔌 **REST APIs**: Endpoints RESTful para todas las operaciones
- 🔒 **CORS configurado**: Comunicación segura entre frontend y backend

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

### Opción 1: Usando el script SQL (Recomendado)

Ejecuta el script `create_databases.sql` en tu cliente MySQL:

```bash
mysql -u root -p < create_databases.sql
```

O desde MySQL Workbench/phpMyAdmin, ejecuta el contenido del archivo `create_databases.sql`.

### Opción 2: Creación manual

Crea ambas BDs en MySQL (las tablas se crean automáticamente al iniciar los microservicios gracias a `spring.jpa.hibernate.ddl-auto=update`):

```sql
CREATE DATABASE IF NOT EXISTS db_categoria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS db_producto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

> **Nota**: Si usas un usuario, contraseña o puerto distintos, actualiza las propiedades `spring.datasource.*` en:
> - `microservicio_backend/categoria-service/src/main/resources/application.properties`
> - `microservicio_backend/producto-service/src/main/resources/application.properties`

---

## 4. Cómo ejecutar el proyecto

### Paso 1: Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Microservicios-Springboot_Lab14
```

### Paso 2: Configurar las bases de datos

Sigue las instrucciones de la sección **3. Configuración de base de datos (MySQL)**.

### Paso 3: Levantar el backend (microservicios)

---

## 5. Levantar el backend (microservicios)

Desde la carpeta raíz del repo:

```bash
cd microservicio_backend
```

### 5.1. Orden recomendado de arranque

**⚠️ IMPORTANTE**: Debes levantar los servicios en el siguiente orden para evitar errores de conexión:

#### 1. Eureka Server (`eureka-server`)
   - **Puerto**: `8761`
   - **Función**: Service Discovery - Registra y descubre los microservicios
   - **Comandos** (desde `microservicio_backend/eureka-server`):
     ```bash
     mvn spring-boot:run
     ```
   - **Verificación**: Abre `http://localhost:8761/` en tu navegador. Deberías ver el dashboard de Eureka.
   - **Espera**: Espera a que el servidor esté completamente iniciado antes de continuar.

#### 2. Categoria Service (`categoria-service`)
   - **Puerto**: `8081`
   - **Base de datos**: `db_categoria`
   - **Comandos** (desde `microservicio_backend/categoria-service`):
     ```bash
     mvn spring-boot:run
     ```
   - **Verificación**: El servicio se registrará automáticamente en Eureka. Puedes verificar en `http://localhost:8761/`.

#### 3. Producto Service (`producto-service`)
   - **Puerto**: `8082`
   - **Base de datos**: `db_producto`
   - **Comandos** (desde `microservicio_backend/producto-service`):
     ```bash
     mvn spring-boot:run
     ```
   - **Verificación**: El servicio se registrará automáticamente en Eureka. Puedes verificar en `http://localhost:8761/`.

#### 4. API Gateway (`api-gateway`)
   - **Puerto**: `8083`
   - **Función**: Punto de entrada centralizado para las APIs
   - **Rutas configuradas**:
     - `/api/categorias/**` → `http://localhost:8081`
     - `/api/productos/**`  → `http://localhost:8082`
   - **Comandos** (desde `microservicio_backend/api-gateway`):
     ```bash
     mvn spring-boot:run
     ```

> **Alternativa**: También puedes generar los `.jar` con `mvn clean package` en cada módulo y ejecutarlos con `java -jar target/nombre-del-servicio.jar`.

### 5.2. Verificar que todos los servicios están corriendo

1. **Eureka Dashboard**: `http://localhost:8761/`
   - Deberías ver registrados: `CATEGORIA-SERVICE` y `PRODUCTO-SERVICE`

2. **Probar endpoints directamente**:
   - Categorías: `http://localhost:8081/api/categorias`
   - Productos: `http://localhost:8082/api/productos`
   - API Gateway: `http://localhost:8083/api/categorias` o `http://localhost:8083/api/productos`

---

## 6. Levantar el frontend (React + Vite)

### 6.1. Navegar a la carpeta del frontend

Desde la raíz del repo:

```bash
cd frontend
```

### 6.2. Instalar dependencias

```bash
npm install
```

Esto instalará todas las dependencias declaradas en `frontend/package.json`:
- React 19
- React Router DOM
- Axios
- Tailwind CSS
- Framer Motion
- Lucide React (iconos)
- Y otras dependencias necesarias

### 6.3. Ejecutar en modo desarrollo

```bash
npm run dev
```

- La aplicación se levantará normalmente en `http://localhost:5173`.
- **⚠️ IMPORTANTE**: Asegúrate de que todos los microservicios de backend estén ya levantados antes de usar el frontend.

### 6.4. Acceder a la aplicación

Una vez que el frontend esté corriendo, abre tu navegador en:

```
http://localhost:5173
```

**Páginas disponibles**:
- `/` - Página de inicio (Home)
- `/categorias` - Gestión de categorías
- `/productos` - Gestión de productos

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

## 9. Resumen de ejecución rápida

Para ejecutar todo el proyecto desde cero:

```bash
# 1. Configurar bases de datos
mysql -u root -p < create_databases.sql

# 2. Terminal 1: Eureka Server
cd microservicio_backend/eureka-server
mvn spring-boot:run

# 3. Terminal 2: Categoria Service
cd microservicio_backend/categoria-service
mvn spring-boot:run

# 4. Terminal 3: Producto Service
cd microservicio_backend/producto-service
mvn spring-boot:run

# 5. Terminal 4: API Gateway
cd microservicio_backend/api-gateway
mvn spring-boot:run

# 6. Terminal 5: Frontend
cd frontend
npm install
npm run dev
```

Luego accede a `http://localhost:5173` en tu navegador.

---

## 10. Información del proyecto

### Último commit

**Commit**: `728b59597d56dc5947c79a17fe8b07429b44d3b2`  
**Mensaje**: "Proyecto terminado"  
**Autor**: yordypillaca <yordy.pillaca@tecsup.edu.pe>  
**Fecha**: Tue Dec 2 13:28:14 2025 -0500

### Estado del proyecto

✅ **Proyecto completado** - Sistema funcional con todas las características implementadas:
- Backend con arquitectura de microservicios
- Frontend moderno con React + Vite
- Integración completa entre frontend y backend
- Gestión completa de categorías y productos
- Interfaz de usuario moderna y responsiva

---

## 11. Documentación adicional

- **Detalle del backend** (configuración, puertos, BDs, orden de arranque):
  - `microservicio_backend/README.md`
- **Detalle del frontend** (estructura de carpetas, componentes, páginas, build, etc.):
  - `frontend/README.md`

---

## 12. Solución de problemas

### Los microservicios no se registran en Eureka
- Verifica que Eureka Server esté corriendo en `http://localhost:8761`
- Asegúrate de haber iniciado Eureka antes que los otros servicios
- Revisa los logs de cada servicio para ver errores de conexión

### Error de conexión a la base de datos
- Verifica que MySQL esté corriendo
- Confirma que las bases de datos `db_categoria` y `db_producto` existan
- Revisa las credenciales en `application.properties`

### El frontend no puede conectar con el backend
- Verifica que todos los microservicios estén corriendo
- Comprueba que los puertos 8081 y 8082 estén disponibles
- Revisa la consola del navegador para ver errores de CORS o conexión

### Puerto ya en uso
- Detén el proceso que está usando el puerto
- En Windows: `netstat -ano | findstr :8081` y luego `taskkill /PID <PID> /F`
- En Linux/Mac: `lsof -ti:8081 | xargs kill -9`

---

Con estos pasos, cualquier persona debería poder levantar **todos los microservicios** y el **frontend** sin inconvenientes.
