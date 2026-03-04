package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.Commande;
import com.ucao.radbackend.repositories.CommandeRepositories;
import com.ucao.radbackend.services.DepenseService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin
public class FinanceController {
    
    private final CommandeRepositories commandeRepositories;
    private final DepenseService depenseService;
    
    public FinanceController(CommandeRepositories commandeRepositories, DepenseService depenseService) {
        this.commandeRepositories = commandeRepositories;
        this.depenseService = depenseService;
    }
    
    @GetMapping("/resume")
    public Map<String, Object> getResume(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        
        // Calculer les ventes (commandes)
        List<Commande> commandes = commandeRepositories.findByDateCommandeBetween(start, end);
        double totalVentes = commandes.stream()
                .mapToDouble(c -> {
                    if (c.getLignesCommande() != null) {
                        c.getLignesCommande().size(); // Force le chargement lazy
                        return c.getLignesCommande().stream()
                                .mapToDouble(l -> l.getPrixUnitaire() * l.getQuantite())
                                .sum();
                    }
                    return 0.0;
                })
                .sum();
        
        // Calculer les dépenses
        double totalDepenses = depenseService.getTotalDepensesBetween(start, end);
        
        // Bénéfice
        double benefice = totalVentes - totalDepenses;
        
        Map<String, Object> resume = new HashMap<>();
        resume.put("totalVentes", totalVentes);
        resume.put("totalDepenses", totalDepenses);
        resume.put("benefice", benefice);
        
        // Pour le mois en cours
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = now.withDayOfMonth(now.toLocalDate().lengthOfMonth())
                .withHour(23).withMinute(59).withSecond(59);
        
        List<Commande> commandesMois = commandeRepositories.findByDateCommandeBetween(startOfMonth, endOfMonth);
        double ventesMois = commandesMois.stream()
                .mapToDouble(c -> {
                    if (c.getLignesCommande() != null) {
                        c.getLignesCommande().size(); // Force le chargement lazy
                        return c.getLignesCommande().stream()
                                .mapToDouble(l -> l.getPrixUnitaire() * l.getQuantite())
                                .sum();
                    }
                    return 0.0;
                })
                .sum();
        
        double depensesMois = depenseService.getTotalDepensesBetween(startOfMonth, endOfMonth);
        double beneficeMois = ventesMois - depensesMois;
        
        resume.put("ventesMois", ventesMois);
        resume.put("depensesMois", depensesMois);
        resume.put("beneficeMois", beneficeMois);
        
        return resume;
    }
}

