package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Commande;
import com.ucao.radbackend.entities.Livraison;
import com.ucao.radbackend.repositories.CommandeRepositories;
import com.ucao.radbackend.repositories.LivraisonRepositories;
import com.ucao.radbackend.services.LivraisonService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivraisonServiceImpl implements LivraisonService {

    private final LivraisonRepositories livraisonRepositories;
    private final CommandeRepositories commandeRepositories;

    public LivraisonServiceImpl(LivraisonRepositories livraisonRepositories,
                                CommandeRepositories commandeRepositories) {
        this.livraisonRepositories = livraisonRepositories;
        this.commandeRepositories = commandeRepositories;
    }

    @Override
    public List<Livraison> getAllLivraisons() {
        return livraisonRepositories.findAll();
    }

    @Override
    public Livraison getLivraisonById(Long id) {
        return livraisonRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison introuvable avec ID : " + id));
    }

    @Override
    public Livraison createLivraison(Livraison livraison) {
        if (livraison.getCommande() != null && livraison.getCommande().getIdCommande() != null) {
            Commande cmd = commandeRepositories.findById(livraison.getCommande().getIdCommande())
                    .orElseThrow(() -> new RuntimeException("Commande introuvable pour la livraison"));
            livraison.setCommande(cmd);
        }
        return livraisonRepositories.save(livraison);
    }

    @Override
    public Livraison updateLivraison(Long id, Livraison newData) {
        Livraison existing = livraisonRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison introuvable avec ID : " + id));

        if (newData.getDateLivraison() != null) existing.setDateLivraison(newData.getDateLivraison());
        if (newData.getAdresseDestination() != null) existing.setAdresseDestination(newData.getAdresseDestination());

        if (newData.getCommande() != null && newData.getCommande().getIdCommande() != null) {
            Commande cmd = commandeRepositories.findById(newData.getCommande().getIdCommande())
                    .orElseThrow(() -> new RuntimeException("Commande introuvable pour mise à jour"));
            existing.setCommande(cmd);
        }

        return livraisonRepositories.save(existing);
    }

    @Override
    public void deleteLivraison(Long id) {
        if (!livraisonRepositories.existsById(id)) {
            throw new RuntimeException("Livraison introuvable avec ID : " + id);
        }
        livraisonRepositories.deleteById(id);
    }
}
