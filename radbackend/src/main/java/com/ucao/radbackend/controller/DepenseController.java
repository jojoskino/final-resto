package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.Depense;
import com.ucao.radbackend.services.DepenseService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/depenses")
@CrossOrigin
public class DepenseController {
    
    private final DepenseService depenseService;
    
    public DepenseController(DepenseService depenseService) {
        this.depenseService = depenseService;
    }
    
    @GetMapping
    public List<Depense> getAll() {
        return depenseService.getAllDepenses();
    }
    
    @GetMapping("/{id}")
    public Depense getById(@PathVariable Long id) {
        return depenseService.getDepenseById(id);
    }
    
    @PostMapping
    public Depense create(@RequestBody Depense depense) {
        return depenseService.createDepense(depense);
    }
    
    @PutMapping("/{id}")
    public Depense update(@PathVariable Long id, @RequestBody Depense depense) {
        return depenseService.updateDepense(id, depense);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        depenseService.deleteDepense(id);
    }
    
    @GetMapping("/total")
    public Double getTotalBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return depenseService.getTotalDepensesBetween(start, end);
    }
    
    @GetMapping("/type/{type}")
    public List<Depense> getByType(@PathVariable Depense.TypeDepense type) {
        return depenseService.getDepensesByType(type);
    }
}





