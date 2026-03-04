package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Commande;
import com.ucao.radbackend.entities.Paiement;
import com.ucao.radbackend.repositories.CommandeRepositories;
import com.ucao.radbackend.repositories.PaiementRepositories;
import com.ucao.radbackend.services.PaiementService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepositories paiementRepositories;
    private final CommandeRepositories commandeRepositories;

    public PaiementServiceImpl(PaiementRepositories paiementRepositories,
                               CommandeRepositories commandeRepositories) {
        this.paiementRepositories = paiementRepositories;
        this.commandeRepositories = commandeRepositories;
    }

    @Override
    public List<Paiement> getAllPaiements() {
        return paiementRepositories.findAll();
    }

    @Override
    public Paiement getPaiementById(Long id) {
        return paiementRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable avec ID : " + id));
    }

    @Override
    public Paiement createPaiement(Paiement paiement) {
        if (paiement.getCommande() != null && paiement.getCommande().getIdCommande() != null) {
            Commande cmd = commandeRepositories.findById(paiement.getCommande().getIdCommande())
                    .orElseThrow(() -> new RuntimeException("Commande introuvable pour le paiement"));
            paiement.setCommande(cmd);
        }
        return paiementRepositories.save(paiement);
    }

    @Override
    public Paiement updatePaiement(Long id, Paiement newData) {
        Paiement existing = paiementRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable avec ID : " + id));

        if (newData.getDatePaiement() != null) existing.setDatePaiement(newData.getDatePaiement());
        if (newData.getMontant() != 0) existing.setMontant(newData.getMontant());
        if (newData.getMethode() != null) existing.setMethode(newData.getMethode());

        if (newData.getCommande() != null && newData.getCommande().getIdCommande() != null) {
            Commande cmd = commandeRepositories.findById(newData.getCommande().getIdCommande())
                    .orElseThrow(() -> new RuntimeException("Commande introuvable pour mise à jour"));
            existing.setCommande(cmd);
        }

        return paiementRepositories.save(existing);
    }

    @Override
    public void deletePaiement(Long id) {
        if (!paiementRepositories.existsById(id)) {
            throw new RuntimeException("Paiement introuvable avec ID : " + id);
        }
        paiementRepositories.deleteById(id);
    }
}
