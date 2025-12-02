-- Script para crear las bases de datos necesarias para el proyecto de microservicios
-- Ejecutar este script en MySQL (phpMyAdmin o línea de comandos)

CREATE DATABASE IF NOT EXISTS db_categoria;
CREATE DATABASE IF NOT EXISTS db_producto;

-- Las tablas se crearán automáticamente cuando se ejecuten los servicios Spring Boot
-- gracias a la configuración spring.jpa.hibernate.ddl-auto=update

