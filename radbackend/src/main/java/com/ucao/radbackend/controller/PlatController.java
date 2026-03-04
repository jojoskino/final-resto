package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.Plat;
import com.ucao.radbackend.services.PlatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plats")
@CrossOrigin
public class PlatController {

    private final PlatService platService;

    public PlatController(PlatService platService) {
        this.platService = platService;
    }

    @GetMapping
    public List<Plat> getAll() {
        return platService.getAllPlats();
    }

    @GetMapping("/{id}")
    public Plat getById(@PathVariable Long id) {
        return platService.getPlatById(id);
    }

    @PostMapping
    public Plat create(@RequestBody Plat plat) {
        return platService.createPlat(plat);
    }

    @PutMapping("/{id}")
    public Plat update(@PathVariable Long id, @RequestBody Plat plat) {
        return platService.updatePlat(id, plat);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        platService.deletePlat(id);
    }
}
