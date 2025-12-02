package com.microservices.controller;

import com.microservices.model.Producto;
import com.microservices.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoRepository repository;

    public ProductoController(ProductoRepository repository){
        this.repository=repository;
    }

    //LISTAR PRODUCTOS
    @GetMapping
    public List<Producto> Listar(){
        return repository.findAll();
    }

    //CREAR PRODUCTO
    @PostMapping
    public Producto crear(@RequestBody Producto producto){
        return repository.save(producto);
    }

    //BUSCAR POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> ObtenerPorId(@PathVariable Long id){
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //ACTUALIZAR PRODUCTO
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id,@RequestBody Producto datosProducto){
        return repository.findById(id)
                .map(productoExistente ->{
                    productoExistente.setNombre(datosProducto.getNombre());
                    productoExistente.setPrecio(datosProducto.getPrecio());
                    productoExistente.setStock(datosProducto.getStock());
                    productoExistente.setCategoriaId(datosProducto.getCategoriaId());
                    return ResponseEntity.ok(repository.save(productoExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    //ELIMINAR PRODUCTO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){

        if(!repository.existsById(id)){
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
