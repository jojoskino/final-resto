package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.Fournisseur;
import java.util.List;

public interface FournisseurService {

    List<Fournisseur> getAllFournisseurs();

    Fournisseur getFournisseurById(Long id);

    Fournisseur createFournisseur(Fournisseur fournisseur);

    Fournisseur updateFournisseur(Long id, Fournisseur fournisseur);

    void deleteFournisseur(Long id);
}
