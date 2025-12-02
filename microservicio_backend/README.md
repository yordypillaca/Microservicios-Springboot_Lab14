# Microservicio Backend - Arquitectura de Categorías y Productos
 
 Este directorio contiene la parte **backend** del proyecto global `Microservicios-Springboot`, implementada como una arquitectura de microservicios con **Spring Boot**, **Spring Cloud** y **MySQL**, organizada en 4 servicios independientes:
 
 - **eureka-server**: Servidor de registro de servicios (Service Discovery).
 - **api-gateway**: Puerta de entrada única para el consumo de los microservicios.
 - **categoria-service**: Microservicio de gestión de categorías, con base de datos `db_categoria`.
 - **producto-service**: Microservicio de gestión de productos, con base de datos `db_producto`.
 
 Cada microservicio es un proyecto Maven independiente (con su propio `pom.xml`).
 
 El frontend del proyecto se encuentra en el directorio hermano `../frontend`, implementado con React + Vite. Consulta su `README.md` y el `README.md` global en la raíz del repositorio para ver cómo se integra con estos microservicios.
 
---

## 1. Arquitectura general

- **Eureka Server (Service Registry)**
  - Expone el panel en: `http://localhost:8761/`
  - Permite registrar y descubrir los microservicios (`categoria-service`, `producto-service`, `api-gateway`).

- **API Gateway**
  - Escucha por defecto en el puerto **8083**.
  - Encaminamiento (routing) configurado en la clase `GatewayConfig.java`.
  - Configuración de CORS en `CorsConfig.java`.
  - Todos los clientes externos deben consumir los microservicios a través del gateway.

- **Categoria Service**
  - Escucha por defecto en el puerto **8081**.
  - Expone operaciones REST para la gestión de categorías.
  - Usa **Spring Data JPA** y **MySQL** con la base de datos `db_categoria`.

- **Producto Service**
  - Escucha por defecto en el puerto **8082**.
  - Expone operaciones REST para la gestión de productos.
  - Usa **Spring Data JPA** y **MySQL** con la base de datos `db_producto`.
  - Incluye dependencia de **Spring Cloud OpenFeign** para facilitar la comunicación con otros microservicios.

---

## 2. Requisitos previos

- **Java 17** (según configuración de los `pom.xml`).
- **Maven 3.8+** o superior.
- **MySQL 8+** (o compatible) ejecutándose en `localhost:3306`.
- Un IDE como IntelliJ IDEA, Eclipse o Spring Tools Suite.
- Opcional: Postman / Insomnia / Thunder Client para probar los endpoints.

---

## 3. Configuración de base de datos

Los microservicios de **categorías** y **productos** utilizan bases de datos separadas:

- Base de datos de categorías: **`db_categoria`**
- Base de datos de productos: **`db_producto`**

En los archivos `application.properties` se tiene configurado:

- En `categoria-service/src/main/resources/application.properties`:
  - `spring.datasource.url=jdbc:mysql://localhost:3306/db_categoria`
  - `spring.datasource.username=root`
  - `spring.datasource.password=` (vacío por defecto; ajusta según tu entorno)
  - `spring.jpa.hibernate.ddl-auto=update`

- En `producto-service/src/main/resources/application.properties`:
  - `spring.datasource.url=jdbc:mysql://localhost:3306/db_producto`
  - `spring.datasource.username=root`
  - `spring.datasource.password=` (vacío por defecto; ajusta según tu entorno)
  - `spring.jpa.hibernate.ddl-auto=update`

### 3.1. Creación de las bases de datos

Antes de levantar los microservicios, es necesario crear las dos bases de datos en MySQL (las **tablas** serán creadas automáticamente por JPA gracias a `spring.jpa.hibernate.ddl-auto=update`).

Ejecutar en MySQL:

```sql
CREATE DATABASE db_categoria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE db_producto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Si tu usuario, contraseña o puerto son diferentes, actualiza las propiedades `spring.datasource.*` en cada microservicio.

---

## 4. Puertos y configuración de los servicios

- **eureka-server**
  - Puerto: **8761**
  - Archivo: `eureka-server/src/main/resources/application.properties`
  - Config principal:
    - `server.port=8761`
    - `eureka.client.register-with-eureka=false`
    - `eureka.client.fetch-registry=false`

- **api-gateway**
  - Puerto: **8083**
  - Archivo: `api-gateway/src/main/resources/application.properties`
  - Config principal:
    - `server.port=8083`
    - `eureka.client.service-url.defaultZone=http://localhost:8761/eureka/`
    - `spring.application.name=api-gateway`

- **categoria-service**
  - Puerto: **8081**
  - Archivo: `categoria-service/src/main/resources/application.properties`
  - Config principal:
    - `server.port=8081`
    - `eureka.client.service-url.defaultZone=http://localhost:8761/eureka/`
    - Configuración de datasource y JPA apuntando a `db_categoria`.

- **producto-service**
  - Puerto: **8082**
  - Archivo: `producto-service/src/main/resources/application.properties`
  - Config principal:
    - `server.port=8082`
    - `eureka.client.service-url.defaultZone=http://localhost:8761/eureka/`
    - Configuración de datasource y JPA apuntando a `db_producto`.

---

## 5. Orden recomendado de ejecución

1. **Levantar MySQL** y asegurarse de que está escuchando en `localhost:3306`.
2. **Crear las bases de datos** `db_categoria` y `db_producto` con los comandos SQL indicados anteriormente.
3. **Levantar `eureka-server`**:
   - Desde consola:
     ```bash
     cd eureka-server
     mvn spring-boot:run
     ```
   - O desde el IDE, ejecutando la clase principal de Spring Boot.
   - Verifica que esté activo en: `http://localhost:8761/`.
4. **Levantar `categoria-service`**:
   - ```bash
     cd categoria-service
     mvn spring-boot:run
     ```
   - Debe registrarse automáticamente en Eureka.
5. **Levantar `producto-service`**:
   - ```bash
     cd producto-service
     mvn spring-boot:run
     ```
   - También se registrará en Eureka.
6. **Levantar `api-gateway`**:
   - ```bash
     cd api-gateway
     mvn spring-boot:run
     ```
   - Este servicio consultará Eureka para enrutar el tráfico hacia los demás microservicios.

> **Nota:** Los comandos `cd` se muestran solo como referencia de navegación en consola. Puedes ejecutar cada proyecto directamente desde tu IDE si lo prefieres.

---

## 6. Pruebas básicas

- **Eureka Server**: `http://localhost:8761/` debe mostrar los servicios registrados.
- **API Gateway**:
  - Las rutas hacia `categoria-service` y `producto-service` están configuradas en `GatewayConfig.java`.
  - Revisa esa clase para conocer los paths exactos a usar (por ejemplo, rutas tipo `/api/categorias`, `/api/productos`, etc., según tu implementación).

---

## 7. Estructura del proyecto

```text
microservicio_backend/
├── api-gateway/
├── categoria-service/
├── eureka-server/
└── producto-service/
```

Cada carpeta contiene su propio `pom.xml`, carpeta `src/` y configuración interna. Consulta los README de cada microservicio para más detalles específicos:

- [`api-gateway/README.md`](api-gateway/README.md)
- [`categoria-service/README.md`](categoria-service/README.md)
- [`eureka-server/README.md`](eureka-server/README.md)
- [`producto-service/README.md`](producto-service/README.md)
