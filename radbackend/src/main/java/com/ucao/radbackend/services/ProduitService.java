package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.Produit;
import java.util.List;

public interface ProduitService {

    List<Produit> getAllProduits();

    Produit getProduitById(Long id);

    Produit createProduit(Produit produit);

    Produit updateProduit(Long id, Produit produit);

    void deleteProduit(Long id);
}
