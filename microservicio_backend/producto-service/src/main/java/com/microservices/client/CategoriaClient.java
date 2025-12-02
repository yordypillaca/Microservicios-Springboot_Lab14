package com.microservices.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "categoria-service")
public interface CategoriaClient {

    @GetMapping("/api/categorias/{id}")
    Object obtenerCategoria(@PathVariable Long id);
}
