package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.LigneCommande;
import java.util.List;

public interface LigneCommandeService {

    List<LigneCommande> getAllLignes();

    LigneCommande getLigneById(Long id);

    LigneCommande createLigne(LigneCommande ligneCommande);

    LigneCommande updateLigne(Long id, LigneCommande ligneCommande);

    void deleteLigne(Long id);
}
