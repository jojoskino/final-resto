package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.LigneCommandeInterne;
import java.util.List;

public interface LigneCommandeInterneService {

    List<LigneCommandeInterne> getAllLignesInternes();

    LigneCommandeInterne getLigneInterneById(Long id);

    LigneCommandeInterne createLigneInterne(LigneCommandeInterne ligneCommandeInterne);

    LigneCommandeInterne updateLigneInterne(Long id, LigneCommandeInterne ligneCommandeInterne);

    void deleteLigneInterne(Long id);
}
