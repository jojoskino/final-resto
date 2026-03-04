package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.Livraison;
import com.ucao.radbackend.services.LivraisonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/livraisons")
@CrossOrigin
public class LivraisonController {

    private final LivraisonService livraisonService;

    public LivraisonController(LivraisonService livraisonService) {
        this.livraisonService = livraisonService;
    }

    @GetMapping
    public List<Livraison> getAll() {
        return livraisonService.getAllLivraisons();
    }

    @GetMapping("/{id}")
    public Livraison getById(@PathVariable Long id) {
        return livraisonService.getLivraisonById(id);
    }

    @PostMapping
    public Livraison create(@RequestBody Livraison livraison) {
        return livraisonService.createLivraison(livraison);
    }

    @PutMapping("/{id}")
    public Livraison update(@PathVariable Long id, @RequestBody Livraison livraison) {
        return livraisonService.updateLivraison(id, livraison);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        livraisonService.deleteLivraison(id);
    }
}
