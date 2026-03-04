package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Commande;
import com.ucao.radbackend.entities.LigneCommande;
import com.ucao.radbackend.entities.Plat;
import com.ucao.radbackend.repositories.CommandeRepositories;
import com.ucao.radbackend.repositories.LigneCommandeRepositories;
import com.ucao.radbackend.repositories.PlatRepositories;
import com.ucao.radbackend.services.LigneCommandeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LigneCommandeServiceImpl implements LigneCommandeService {

    private final LigneCommandeRepositories ligneCommandeRepositories;
    private final CommandeRepositories commandeRepositories;
    private final PlatRepositories platRepositories;

    public LigneCommandeServiceImpl(LigneCommandeRepositories ligneCommandeRepositories,
                                    CommandeRepositories commandeRepositories,
                                    PlatRepositories platRepositories) {
        this.ligneCommandeRepositories = ligneCommandeRepositories;
        this.commandeRepositories = commandeRepositories;
        this.platRepositories = platRepositories;
    }

    @Override
    public List<LigneCommande> getAllLignes() {
        return ligneCommandeRepositories.findAll();
    }

    @Override
    public LigneCommande getLigneById(Long id) {
        return ligneCommandeRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("LigneCommande introuvable avec ID : " + id));
    }

    @Override
    public LigneCommande createLigne(LigneCommande ligneCommande) {
        if (ligneCommande.getCommande() != null && ligneCommande.getCommande().getIdCommande() != null) {
            Commande commande = commandeRepositories.findById(ligneCommande.getCommande().getIdCommande())
                    .orElseThrow(() -> new RuntimeException("Commande introuvable pour la ligne"));
            ligneCommande.setCommande(commande);
        }

        if (ligneCommande.getPlat() != null && ligneCommande.getPlat().getIdPlat() != null) {
            Plat plat = platRepositories.findById(ligneCommande.getPlat().getIdPlat())
                    .orElseThrow(() -> new RuntimeException("Plat introuvable pour la ligne"));
            ligneCommande.setPlat(plat);
        }

        return ligneCommandeRepositories.save(ligneCommande);
    }

    @Override
    public LigneCommande updateLigne(Long id, LigneCommande newData) {
        LigneCommande existing = ligneCommandeRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("LigneCommande introuvable avec ID : " + id));

        existing.setQuantite(newData.getQuantite());
        existing.setPrixUnitaire(newData.getPrixUnitaire());

        if (newData.getCommande() != null && newData.getCommande().getIdCommande() != null) {
            Commande commande = commandeRepositories.findById(newData.getCommande().getIdCommande())
                    .orElseThrow(() -> new RuntimeException("Commande introuvable pour mise à jour"));
            existing.setCommande(commande);
        }

        if (newData.getPlat() != null && newData.getPlat().getIdPlat() != null) {
            Plat plat = platRepositories.findById(newData.getPlat().getIdPlat())
                    .orElseThrow(() -> new RuntimeException("Plat introuvable pour mise à jour"));
            existing.setPlat(plat);
        }

        return ligneCommandeRepositories.save(existing);
    }

    @Override
    public void deleteLigne(Long id) {
        if (!ligneCommandeRepositories.existsById(id)) {
            throw new RuntimeException("LigneCommande introuvable avec ID : " + id);
        }
        ligneCommandeRepositories.deleteById(id);
    }
}
