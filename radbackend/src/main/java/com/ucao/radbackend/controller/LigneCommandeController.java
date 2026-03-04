package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.LigneCommande;
import com.ucao.radbackend.services.LigneCommandeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lignes")
@CrossOrigin
public class LigneCommandeController {

    private final LigneCommandeService ligneCommandeService;

    public LigneCommandeController(LigneCommandeService ligneCommandeService) {
        this.ligneCommandeService = ligneCommandeService;
    }

    @GetMapping
    public List<LigneCommande> getAll() {
        return ligneCommandeService.getAllLignes();
    }

    @GetMapping("/{id}")
    public LigneCommande getById(@PathVariable Long id) {
        return ligneCommandeService.getLigneById(id);
    }

    @PostMapping
    public LigneCommande create(@RequestBody LigneCommande ligneCommande) {
        return ligneCommandeService.createLigne(ligneCommande);
    }

    @PutMapping("/{id}")
    public LigneCommande update(@PathVariable Long id, @RequestBody LigneCommande ligneCommande) {
        return ligneCommandeService.updateLigne(id, ligneCommande);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ligneCommandeService.deleteLigne(id);
    }
}
