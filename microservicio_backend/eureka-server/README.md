# Eureka Server

Este módulo implementa el **servidor Eureka** (Service Registry) de la arquitectura. Su función es permitir el **descubrimiento de servicios** (service discovery) entre los distintos microservicios del sistema.

---

## 1. Responsabilidad del microservicio

- Actuar como **registro centralizado** donde se inscriben los microservicios clientes (`categoria-service`, `producto-service`, `api-gateway`).
- Permitir que los servicios se descubran entre sí dinámicamente sin depender de direcciones IP o puertos fijos.
- Proveer una **consola web** para visualizar los servicios registrados.

---

## 2. Tecnologías utilizadas

- **Java 17**
- **Spring Boot** (starter parent 4.0.0)
- **Spring Web MVC** (`spring-boot-starter-webmvc`)
- **Spring Cloud Netflix Eureka Server**
- **Spring Boot DevTools** (para desarrollo)
- Dependencias de prueba para Web (`spring-boot-starter-webmvc-test`)

---

## 3. Configuración principal

Archivo: `src/main/resources/application.properties`

```properties
server.port=8761

eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

### Detalles importantes

- **Puerto**: `8761`.
- `register-with-eureka=false` y `fetch-registry=false` indican que este servicio es el **servidor Eureka** (no un cliente).
- La consola web de Eureka estará disponible en: `http://localhost:8761/`.

---

## 4. Ejecución del servicio

### 4.1. Prerrequisitos

- Java 17 y Maven instalados.

### 4.2. Comandos de ejecución

Desde la carpeta `eureka-server`:

```bash
mvn spring-boot:run
```

O genera el `.jar` y ejecútalo:

```bash
mvn clean package
java -jar target/eureka-server-0.0.1-SNAPSHOT.jar
```

Una vez levantado, abre en el navegador:

- `http://localhost:8761/`

Ahí podrás ver los servicios que se registren, como:

- `CATEGORIA-SERVICE` (según el `spring.application.name` que definas).
- `PRODUCTO-SERVICE`.
- `API-GATEWAY`.

---

## 5. Integración con el resto de microservicios

- **Categoria Service**: se registrará en Eureka, permitiendo que otros servicios descubran sus instancias.
- **Producto Service**: también se registra y puede consumir otros servicios usando el Service Discovery.
- **API Gateway**: utiliza Eureka para enrutar las peticiones a los microservicios.

Eureka es un componente clave en la arquitectura de **microservicios**, ya que elimina la necesidad de configurar manualmente las URLs de cada servicio en todos los demás.

---

## 6. Buenas prácticas

- Levanta siempre primero el **Eureka Server** antes de iniciar los microservicios clientes.
- Monitorea la consola de Eureka para verificar el estado de las instancias (UP/DOWN).
- Configura timeouts y políticas de renovación de registros (`leaseRenewalIntervalInSeconds`, `leaseExpirationDurationInSeconds`) si necesitas un control más fino sobre la disponibilidad.
