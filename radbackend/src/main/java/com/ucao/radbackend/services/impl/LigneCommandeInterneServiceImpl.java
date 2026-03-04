package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.CommandeInterne;
import com.ucao.radbackend.entities.Produit;
import com.ucao.radbackend.entities.LigneCommandeInterne;
import com.ucao.radbackend.repositories.CommandeInterneRepositories;
import com.ucao.radbackend.repositories.ProduitRepositories;
import com.ucao.radbackend.repositories.LigneCommandeInterneRepositories;
import com.ucao.radbackend.services.LigneCommandeInterneService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LigneCommandeInterneServiceImpl implements LigneCommandeInterneService {

    private final LigneCommandeInterneRepositories ligneCommandeInterneRepositories;
    private final CommandeInterneRepositories commandeInterneRepositories;
    private final ProduitRepositories produitRepositories;

    public LigneCommandeInterneServiceImpl(LigneCommandeInterneRepositories ligneCommandeInterneRepositories,
                                           CommandeInterneRepositories commandeInterneRepositories,
                                           ProduitRepositories produitRepositories) {
        this.ligneCommandeInterneRepositories = ligneCommandeInterneRepositories;
        this.commandeInterneRepositories = commandeInterneRepositories;
        this.produitRepositories = produitRepositories;
    }

    @Override
    public List<LigneCommandeInterne> getAllLignesInternes() {
        return ligneCommandeInterneRepositories.findAll();
    }

    @Override
    public LigneCommandeInterne getLigneInterneById(Long id) {
        return ligneCommandeInterneRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("LigneCommandeInterne introuvable avec ID : " + id));
    }

    @Override
    public LigneCommandeInterne createLigneInterne(LigneCommandeInterne ligneCommandeInterne) {

        if (ligneCommandeInterne.getCommandeInterne() != null &&
                ligneCommandeInterne.getCommandeInterne().getIdCommandeInterne() != null) {
            CommandeInterne cmd = commandeInterneRepositories.findById(
                            ligneCommandeInterne.getCommandeInterne().getIdCommandeInterne())
                    .orElseThrow(() -> new RuntimeException("CommandeInterne introuvable pour la ligne"));
            ligneCommandeInterne.setCommandeInterne(cmd);
        }

        if (ligneCommandeInterne.getProduit() != null &&
                ligneCommandeInterne.getProduit().getIdProduit() != null) {
            Produit produit = produitRepositories.findById(
                            ligneCommandeInterne.getProduit().getIdProduit())
                    .orElseThrow(() -> new RuntimeException("Produit introuvable pour la ligne"));
            ligneCommandeInterne.setProduit(produit);
        }

        return ligneCommandeInterneRepositories.save(ligneCommandeInterne);
    }

    @Override
    public LigneCommandeInterne updateLigneInterne(Long id, LigneCommandeInterne newData) {
        LigneCommandeInterne existing = ligneCommandeInterneRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("LigneCommandeInterne introuvable avec ID : " + id));

        existing.setQuantite(newData.getQuantite());

        if (newData.getCommandeInterne() != null &&
                newData.getCommandeInterne().getIdCommandeInterne() != null) {
            CommandeInterne cmd = commandeInterneRepositories.findById(
                            newData.getCommandeInterne().getIdCommandeInterne())
                    .orElseThrow(() -> new RuntimeException("CommandeInterne introuvable pour mise à jour"));
            existing.setCommandeInterne(cmd);
        }

        if (newData.getProduit() != null &&
                newData.getProduit().getIdProduit() != null) {
            Produit produit = produitRepositories.findById(
                            newData.getProduit().getIdProduit())
                    .orElseThrow(() -> new RuntimeException("Produit introuvable pour mise à jour"));
            existing.setProduit(produit);
        }

        return ligneCommandeInterneRepositories.save(existing);
    }

    @Override
    public void deleteLigneInterne(Long id) {
        if (!ligneCommandeInterneRepositories.existsById(id)) {
            throw new RuntimeException("LigneCommandeInterne introuvable avec ID : " + id);
        }
        ligneCommandeInterneRepositories.deleteById(id);
    }
}
