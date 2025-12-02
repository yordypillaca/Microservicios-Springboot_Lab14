# Categoria Service

Este módulo implementa el microservicio de **gestión de categorías**. Se encarga de exponer operaciones REST relacionadas con las categorías que luego son consumidas por otros servicios dentro de la arquitectura (por ejemplo, productos).

---

## 1. Responsabilidad del microservicio

- Administrar la información de **categorías** (por ejemplo: nombre, descripción u otros campos definidos en las entidades).
- Exponer endpoints REST para operaciones típicas (por ejemplo: listar, crear, actualizar, eliminar categorías), según la implementación que tengas en tus controladores.
- Persistir la información en la base de datos **MySQL** `db_categoria` usando **Spring Data JPA**.
- Registrarse en **Eureka Server** para permitir que otros servicios (y el API Gateway) lo descubran.

---

## 2. Tecnologías utilizadas

- **Java 17**
- **Spring Boot** (starter parent 4.0.0)
- **Spring Web MVC** (`spring-boot-starter-webmvc`)
- **Spring Data JPA** (`spring-boot-starter-data-jpa`)
- **Spring Cloud Netflix Eureka Client**
- **MySQL** (`mysql-connector-j`)
- **Lombok** (para reducir código boilerplate)
- Dependencias de prueba para Web y JPA (`spring-boot-starter-webmvc-test`, `spring-boot-starter-data-jpa-test`)

---

## 3. Configuración principal

Archivo: `src/main/resources/application.properties`

```properties
server.port=8081

eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

spring.datasource.url=jdbc:mysql://localhost:3306/db_categoria
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
```

### Detalles importantes

- **Puerto**: `8081`.
- **Eureka**: el servicio se registra en `http://localhost:8761/eureka/`.
- **Base de datos**: utiliza la base **`db_categoria`** en MySQL.
- `spring.jpa.hibernate.ddl-auto=update` hace que las **tablas se creen y actualicen automáticamente** a partir de las entidades JPA cuando el microservicio se levanta.

> Asegúrate de que la base de datos `db_categoria` exista antes de iniciar el servicio.

---

## 4. Creación de la base de datos `db_categoria`

En tu servidor MySQL, crea la base de datos con el siguiente comando:

```sql
CREATE DATABASE db_categoria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Si tu usuario, contraseña o puerto de MySQL son distintos, ajusta las propiedades `spring.datasource.*` en `application.properties`.

---

## 5. Ejecución del servicio

### 5.1. Prerrequisitos

- **MySQL** ejecutándose y con la base `db_categoria` creada.
- **Eureka Server** levantado en el puerto 8761.
- Java 17 y Maven instalados.

### 5.2. Comandos de ejecución

Desde la carpeta `categoria-service`:

```bash
mvn spring-boot:run
```

O genera el `.jar` y ejecútalo:

```bash
mvn clean package
java -jar target/categoria-service-0.0.1-SNAPSHOT.jar
```

Una vez levantado:

- Verifica en `http://localhost:8761/` que `categoria-service` aparezca registrado en Eureka.

---

## 6. Integración con otros componentes

- **Eureka Server**: permite que `categoria-service` sea descubierto por otros servicios.
- **API Gateway**: enruta las peticiones externas a los endpoints de categorías.
- **Producto Service** (u otros): pueden consumir este servicio a través de llamadas HTTP directas o a través de Feign (según tu implementación).

---

## 7. Notas y buenas prácticas

- Mantén tus entidades, repositorios y servicios alineados con la estructura de la base de datos.
- Usa DTOs para exponer datos hacia el exterior si quieres desacoplar el modelo interno.
- Maneja correctamente los errores (por ejemplo, categoría no encontrada) mediante respuestas HTTP adecuadas (404, 400, etc.).
- Puedes añadir pruebas unitarias y de integración utilizando las dependencias de test ya definidas en el `pom.xml`.
