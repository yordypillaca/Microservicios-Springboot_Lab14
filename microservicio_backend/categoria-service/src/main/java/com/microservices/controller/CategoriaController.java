package com.microservices.controller;

import com.microservices.model.Categoria;
import com.microservices.repository.CategoriaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository repository;

    public CategoriaController(CategoriaRepository repository){
        this.repository=repository;
    }

    //LISTAR CATEGORIA
    @GetMapping
    public List<Categoria> Listar(){
        return repository.findAll();
    }

    //CREAR CATEGORIA
    @PostMapping
    public Categoria crear(@RequestBody Categoria categoria){
        return repository.save(categoria);
    }

    //buscar
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> ObtenerPorId(@PathVariable Long id){
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizar(@PathVariable Long id,@RequestBody Categoria datosCategoria){
        return repository.findById(id)
                .map(categoriaExistente ->{
                    categoriaExistente.setNombre(datosCategoria.getNombre());
                    return ResponseEntity.ok(repository.save(categoriaExistente));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    //eliminar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){

        if(!repository.existsById(id)){
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
                return ResponseEntity.noContent().build();
    }



}
