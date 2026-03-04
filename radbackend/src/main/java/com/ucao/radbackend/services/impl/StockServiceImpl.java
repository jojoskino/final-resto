package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Depense;
import com.ucao.radbackend.entities.Fournisseur;
import com.ucao.radbackend.entities.Produit;
import com.ucao.radbackend.entities.Stock;
import com.ucao.radbackend.repositories.DepenseRepositories;
import com.ucao.radbackend.repositories.FournisseurRepositories;
import com.ucao.radbackend.repositories.ProduitRepositories;
import com.ucao.radbackend.repositories.StockRepositories;
import com.ucao.radbackend.services.StockService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockServiceImpl implements StockService {
    // Service implementation for Stock management

    private final StockRepositories stockRepositories;
    private final ProduitRepositories produitRepositories;
    private final FournisseurRepositories fournisseurRepositories;
    private final DepenseRepositories depenseRepositories;

    public StockServiceImpl(StockRepositories stockRepositories, ProduitRepositories produitRepositories, FournisseurRepositories fournisseurRepositories, DepenseRepositories depenseRepositories) {
        this.stockRepositories = stockRepositories;
        this.produitRepositories = produitRepositories;
        this.fournisseurRepositories = fournisseurRepositories;
        this.depenseRepositories = depenseRepositories;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Stock> getAllStocks() {
        // Avec FetchType.EAGER, les relations sont chargées automatiquement
        return stockRepositories.findAll();
    }

    @Override
    public Stock getStockById(Long id) {
        return stockRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock introuvable avec ID : " + id));
    }

    @Override
    @Transactional
    public Stock createStock(Stock stock) {
        // Gérer le produit
        if (stock.getProduit() != null) {
            if (stock.getProduit().getIdProduit() != null) {
                // Produit existant
                Produit produit = produitRepositories.findById(stock.getProduit().getIdProduit())
                        .orElseThrow(() -> new RuntimeException("Produit introuvable pour le stock"));
                stock.setProduit(produit);
            } else if (stock.getProduit().getNom() != null) {
                // Créer un nouveau produit
                Produit nouveauProduit = new Produit();
                nouveauProduit.setNom(stock.getProduit().getNom());
                nouveauProduit.setPrix(stock.getProduit().getPrix());
                nouveauProduit.setStock(0); // Le stock est géré par l'entité Stock
                nouveauProduit = produitRepositories.save(nouveauProduit);
                stock.setProduit(nouveauProduit);
            }
        }

        // Gérer le fournisseur
        if (stock.getFournisseur() != null && stock.getFournisseur().getIdFournisseur() != null) {
            Fournisseur fournisseur = fournisseurRepositories.findById(stock.getFournisseur().getIdFournisseur())
                    .orElseThrow(() -> new RuntimeException("Fournisseur introuvable pour le stock"));
            stock.setFournisseur(fournisseur);
        }

        // Définir le seuil par défaut si non défini
        if (stock.getSeuil() == null || stock.getSeuil() == 0) {
            stock.setSeuil(10);
        }
        // Définir la quantité par défaut si non définie
        if (stock.getQuantite() == null) {
            stock.setQuantite(0);
        }

        Stock savedStock = stockRepositories.save(stock);

        // Créer automatiquement une dépense pour l'achat du produit
        if (savedStock.getProduit() != null && savedStock.getFournisseur() != null) {
            double montantDepense = savedStock.getProduit().getPrix() * savedStock.getQuantite();
            if (montantDepense > 0) {
                Depense depense = new Depense();
                depense.setLibelle("Achat de " + savedStock.getProduit().getNom());
                depense.setMontant(montantDepense);
                depense.setDescription("Achat de " + savedStock.getQuantite() + " unité(s) de " + savedStock.getProduit().getNom() + " auprès de " + savedStock.getFournisseur().getNom());
                depense.setTypeDepense(Depense.TypeDepense.ACHAT_PRODUITS);
                depense.setDateDepense(LocalDateTime.now());
                depense.setFournisseur(savedStock.getFournisseur());
                depenseRepositories.save(depense);
            }
        }

        return savedStock;
    }

    @Override
    @Transactional
    public Stock updateStock(Long id, Stock newData) {
        Stock existing = stockRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock introuvable avec ID : " + id));

        if (newData.getQuantite() != null) {
            existing.setQuantite(newData.getQuantite());
        }
        if (newData.getSeuil() != null && newData.getSeuil() > 0) {
            existing.setSeuil(newData.getSeuil());
        }

        // Gérer le produit
        if (newData.getProduit() != null) {
            if (newData.getProduit().getIdProduit() != null) {
                // Produit existant - mettre à jour ses propriétés si fournies
                Produit produit = produitRepositories.findById(newData.getProduit().getIdProduit())
                        .orElseThrow(() -> new RuntimeException("Produit introuvable pour mise à jour"));
                
                // Mettre à jour le nom et le prix si fournis
                if (newData.getProduit().getNom() != null && !newData.getProduit().getNom().isEmpty()) {
                    produit.setNom(newData.getProduit().getNom());
                }
                if (newData.getProduit().getPrix() > 0) {
                    produit.setPrix(newData.getProduit().getPrix());
                }
                produit = produitRepositories.save(produit);
                existing.setProduit(produit);
            } else if (newData.getProduit().getNom() != null) {
                // Créer un nouveau produit si pas d'ID
                Produit nouveauProduit = new Produit();
                nouveauProduit.setNom(newData.getProduit().getNom());
                nouveauProduit.setPrix(newData.getProduit().getPrix());
                nouveauProduit.setStock(0);
                nouveauProduit = produitRepositories.save(nouveauProduit);
                existing.setProduit(nouveauProduit);
            }
        }

        if (newData.getFournisseur() != null && newData.getFournisseur().getIdFournisseur() != null) {
            Fournisseur fournisseur = fournisseurRepositories.findById(newData.getFournisseur().getIdFournisseur())
                    .orElseThrow(() -> new RuntimeException("Fournisseur introuvable pour mise à jour"));
            existing.setFournisseur(fournisseur);
        }

        return stockRepositories.save(existing);
    }

    @Override
    public void deleteStock(Long id) {
        if (!stockRepositories.existsById(id)) {
            throw new RuntimeException("Stock introuvable avec ID : " + id);
        }
        stockRepositories.deleteById(id);
    }
}
