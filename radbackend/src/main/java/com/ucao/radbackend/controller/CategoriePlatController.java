package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.CategoriePlat;
import com.ucao.radbackend.services.CategoriePlatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategoriePlatController {

    private final CategoriePlatService categoriePlatService;

    public CategoriePlatController(CategoriePlatService categoriePlatService) {
        this.categoriePlatService = categoriePlatService;
    }

    @GetMapping
    public List<CategoriePlat> getAll() {
        return categoriePlatService.getAllCategories();
    }

    @GetMapping("/{id}")
    public CategoriePlat getById(@PathVariable Long id) {
        return categoriePlatService.getCategorieById(id);
    }

    @PostMapping
    public CategoriePlat create(@RequestBody CategoriePlat categoriePlat) {
        return categoriePlatService.createCategorie(categoriePlat);
    }

    @PutMapping("/{id}")
    public CategoriePlat update(@PathVariable Long id, @RequestBody CategoriePlat categoriePlat) {
        return categoriePlatService.updateCategorie(id, categoriePlat);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoriePlatService.deleteCategorie(id);
    }
}
