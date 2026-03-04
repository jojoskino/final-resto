package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.LigneCommandeInterne;
import com.ucao.radbackend.services.LigneCommandeInterneService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ligne-commandes-internes")
@CrossOrigin
public class LigneCommandeInterneController {

    private final LigneCommandeInterneService ligneCommandeInterneService;

    public LigneCommandeInterneController(LigneCommandeInterneService ligneCommandeInterneService) {
        this.ligneCommandeInterneService = ligneCommandeInterneService;
    }

    @GetMapping
    public List<LigneCommandeInterne> getAll() {
        return ligneCommandeInterneService.getAllLignesInternes();
    }

    @GetMapping("/{id}")
    public LigneCommandeInterne getById(@PathVariable Long id) {
        return ligneCommandeInterneService.getLigneInterneById(id);
    }

    @PostMapping
    public LigneCommandeInterne create(@RequestBody LigneCommandeInterne ligneCommandeInterne) {
        return ligneCommandeInterneService.createLigneInterne(ligneCommandeInterne);
    }

    @PutMapping("/{id}")
    public LigneCommandeInterne update(@PathVariable Long id, @RequestBody LigneCommandeInterne ligneCommandeInterne) {
        return ligneCommandeInterneService.updateLigneInterne(id, ligneCommandeInterne);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        ligneCommandeInterneService.deleteLigneInterne(id);
    }
}
