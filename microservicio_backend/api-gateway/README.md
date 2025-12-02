# API Gateway

Este módulo implementa el **API Gateway** de la arquitectura de microservicios. Su objetivo es actuar como **punto de entrada único** para los clientes externos y enrutar las peticiones hacia los microservicios internos (`categoria-service` y `producto-service`).

---

## 1. Características principales

- Implementado con **Spring Boot** y **Spring Cloud Gateway**.
- Registrado en **Eureka Server** como cliente.
- Enrutamiento configurado en la clase `GatewayConfig.java`.
- Configuración de **CORS** centralizada en `CorsConfig.java`.
- Expone un único puerto a los clientes externos, simplificando el consumo de los servicios.

---

## 2. Tecnologías utilizadas

- **Java 17**
- **Spring Boot** (starter parent 4.0.0)
- **Spring Cloud Gateway** (`spring-cloud-starter-gateway-server-webmvc`)
- **Spring Cloud Netflix Eureka Client**
- **Spring Boot DevTools** (para desarrollo)
- **Spring Boot Starter Test** (para pruebas)

---

## 3. Configuración principal

Archivo: `src/main/resources/application.properties`

```properties
server.port=8083

# Registro en Eureka
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/

spring.application.name=api-gateway

# Deshabilitar el manejo por defecto de recursos estáticos
spring.web.resources.add-mappings=false
```

- **Puerto**: `8083`
- El gateway se registra en Eureka y descubre dinámicamente los servicios de categorías y productos para enrutar el tráfico.

Las rutas específicas expuestas por el gateway se definen en la clase `GatewayConfig.java`. Allí se configuran los **predicados** de ruta y los **URIs** de destino basados en los IDs de los servicios registrados en Eureka.

---

## 4. Ejecución del servicio

### 4.1. Prerrequisitos

- Tener **Eureka Server** levantado (`eureka-server` en el puerto 8761).
- Tener configurado Java 17 y Maven.

### 4.2. Comandos de ejecución

Desde la raíz de este módulo (`api-gateway`):

```bash
mvn spring-boot:run
```

O bien, generar el `.jar` y ejecutarlo:

```bash
mvn clean package
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
```

> Asegúrate de que `eureka-server` esté en ejecución antes de iniciar el gateway, para que pueda registrarse y descubrir los demás servicios.

---

## 5. Flujo de peticiones

1. El cliente (frontend, Postman, etc.) envía las peticiones HTTP al puerto **8083** del API Gateway.
2. El gateway, usando la configuración de `GatewayConfig.java`, determina a qué microservicio debe redirigir la solicitud.
3. El gateway consulta **Eureka** para resolver la ubicación real de los servicios (`categoria-service`, `producto-service`).
4. La respuesta del microservicio se devuelve al cliente a través del gateway.

Este patrón permite:

- Centralizar políticas de CORS, autenticación, logging y rate limiting (si se implementan).
- Evitar que los clientes conozcan los puertos internos de cada microservicio.

---

## 6. Configuración de CORS

La política de CORS está centralizada en la clase `CorsConfig.java`, donde se definen los **orígenes permitidos**, **métodos permitidos**, **headers**, etc. De esta forma, se controla qué frontends o dominios pueden consumir la API a través del gateway.

Revisa `CorsConfig.java` para ajustar:

- Orígenes (`allowedOrigins`)
- Métodos HTTP (`allowedMethods`)
- Headers (`allowedHeaders`)

---

## 7. Integración con el resto del sistema

- **Eureka Server** (`eureka-server`): el gateway se registra como cliente y utiliza el service discovery para enrutar.
- **Categoria Service** (`categoria-service`): el gateway define rutas hacia los endpoints REST relacionados con categorías.
- **Producto Service** (`producto-service`): el gateway define rutas hacia los endpoints REST relacionados con productos.

Consulta el `README.md` de cada microservicio para más detalles sobre sus endpoints específicos.
