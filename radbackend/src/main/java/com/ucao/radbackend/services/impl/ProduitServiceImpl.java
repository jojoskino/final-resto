package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Produit;
import com.ucao.radbackend.repositories.ProduitRepositories;
import com.ucao.radbackend.services.ProduitService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProduitServiceImpl implements ProduitService {

    private final ProduitRepositories produitRepositories;

    public ProduitServiceImpl(ProduitRepositories produitRepositories) {
        this.produitRepositories = produitRepositories;
    }

    @Override
    public List<Produit> getAllProduits() {
        return produitRepositories.findAll();
    }

    @Override
    public Produit getProduitById(Long id) {
        return produitRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable avec ID : " + id));
    }

    @Override
    public Produit createProduit(Produit produit) {
        return produitRepositories.save(produit);
    }

    @Override
    public Produit updateProduit(Long id, Produit newData) {
        Produit existing = produitRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable avec ID : " + id));

        if (newData.getNom() != null) existing.setNom(newData.getNom());
        if (newData.getPrix() != 0) existing.setPrix(newData.getPrix());
        existing.setStock(newData.getStock());

        return produitRepositories.save(existing);
    }

    @Override
    public void deleteProduit(Long id) {
        if (!produitRepositories.existsById(id)) {
            throw new RuntimeException("Produit introuvable avec ID : " + id);
        }
        produitRepositories.deleteById(id);
    }
}
