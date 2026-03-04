package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.CommandeInterne;
import com.ucao.radbackend.services.CommandeInterneService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commandes-internes")
@CrossOrigin
public class CommandeInterneController {

    private final CommandeInterneService commandeInterneService;

    public CommandeInterneController(CommandeInterneService commandeInterneService) {
        this.commandeInterneService = commandeInterneService;
    }

    @GetMapping
    public List<CommandeInterne> getAll() {
        return commandeInterneService.getAllCommandesInternes();
    }

    @GetMapping("/{id}")
    public CommandeInterne getById(@PathVariable Long id) {
        return commandeInterneService.getCommandeInterneById(id);
    }

    @PostMapping
    public CommandeInterne create(@RequestBody CommandeInterne commandeInterne) {
        return commandeInterneService.createCommandeInterne(commandeInterne);
    }

    @PutMapping("/{id}")
    public CommandeInterne update(@PathVariable Long id, @RequestBody CommandeInterne commandeInterne) {
        return commandeInterneService.updateCommandeInterne(id, commandeInterne);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        commandeInterneService.deleteCommandeInterne(id);
    }
}
