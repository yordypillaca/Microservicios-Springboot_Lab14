# Producto Service

Este módulo implementa el microservicio de **gestión de productos**. Se encarga de exponer operaciones REST relacionadas con los productos del sistema y de persistir su información en una base de datos independiente.

---

## 1. Responsabilidad del microservicio

- Administrar la información de **productos** (campos según tus entidades: nombre, precio, stock, categoría, etc.).
- Exponer endpoints REST para operaciones típicas (por ejemplo: listar, crear, actualizar, eliminar productos), según tu implementación.
- Persistir los datos en la base de datos **MySQL** `db_producto` usando **Spring Data JPA**.
- Registrarse en **Eureka Server** para ser descubierto por el **API Gateway** y otros servicios.
- Incluir la dependencia de **Spring Cloud OpenFeign**, lo que facilita la comunicación con otros microservicios (por ejemplo, para consultar información de categorías) en caso de que se configure.

---

## 2. Tecnologías utilizadas

- **Java 17**
- **Spring Boot** (starter parent 4.0.0)
- **Spring Web MVC** (`spring-boot-starter-webmvc`)
- **Spring Data JPA** (`spring-boot-starter-data-jpa`)
- **Spring Cloud Netflix Eureka Client**
- **Spring Cloud OpenFeign** (`spring-cloud-starter-openfeign`)
- **MySQL** (`mysql-connector-j`)
- **Lombok** (para reducir código boilerplate)
- Dependencias de prueba para Web y JPA (`spring-boot-starter-webmvc-test`, `spring-boot-starter-data-jpa-test`)

---

## 3. Configuración principal

Archivo: `src/main/resources/application.properties`

```properties
server.port=8082

eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

spring.datasource.url=jdbc:mysql://localhost:3306/db_producto
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
```

### Detalles importantes

- **Puerto**: `8082`.
- **Eureka**: el servicio se registra en `http://localhost:8761/eureka/`.
- **Base de datos**: utiliza la base **`db_producto`** en MySQL.
- `spring.jpa.hibernate.ddl-auto=update` hace que las **tablas se creen y actualicen automáticamente** a partir de las entidades JPA cuando el microservicio se inicia.

> Asegúrate de que la base de datos `db_producto` exista antes de iniciar el servicio.

---

## 4. Creación de la base de datos `db_producto`

En tu servidor MySQL, crea la base de datos con el siguiente comando:

```sql
CREATE DATABASE db_producto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Si tu usuario, contraseña o puerto de MySQL son distintos, ajusta las propiedades `spring.datasource.*` en `application.properties`.

---

## 5. Ejecución del servicio

### 5.1. Prerrequisitos

- **MySQL** ejecutándose y con la base `db_producto` creada.
- **Eureka Server** levantado en el puerto 8761.
- Java 17 y Maven instalados.

### 5.2. Comandos de ejecución

Desde la carpeta `producto-service`:

```bash
mvn spring-boot:run
```

O genera el `.jar` y ejecútalo:

```bash
mvn clean package
java -jar target/producto-service-0.0.1-SNAPSHOT.jar
```

Luego:

- Verifica en `http://localhost:8761/` que `producto-service` aparezca registrado en Eureka.

---

## 6. Integración con otros componentes

- **Eureka Server**: permite el registro y descubrimiento del microservicio.
- **API Gateway**: enruta las peticiones externas hacia los endpoints de productos.
- **Categoria Service**: puede ser consumido mediante HTTP o Feign (según tu implementación) para enriquecer la información de un producto con datos de su categoría.

---

## 7. Notas y buenas prácticas

- Mantén las relaciones entre entidades (por ejemplo, producto-categoría) bien modeladas en JPA.
- Usa DTOs y mapeadores para desacoplar el modelo de dominio del modelo expuesto al cliente.
- Maneja correctamente errores como producto no encontrado, stock insuficiente, etc., usando códigos HTTP adecuados.
- Aprovecha las capacidades de Feign si necesitas comunicarte frecuentemente con otros microservicios.
