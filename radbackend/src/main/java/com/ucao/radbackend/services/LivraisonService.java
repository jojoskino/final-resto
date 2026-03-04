package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.Livraison;
import java.util.List;

public interface LivraisonService {

    List<Livraison> getAllLivraisons();

    Livraison getLivraisonById(Long id);

    Livraison createLivraison(Livraison livraison);

    Livraison updateLivraison(Long id, Livraison livraison);

    void deleteLivraison(Long id);
}
