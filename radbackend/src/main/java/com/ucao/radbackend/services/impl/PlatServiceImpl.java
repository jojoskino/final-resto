package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.CategoriePlat;
import com.ucao.radbackend.entities.Plat;
import com.ucao.radbackend.repositories.CategoriePlatRepositories;
import com.ucao.radbackend.repositories.PlatRepositories;
import com.ucao.radbackend.services.PlatService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlatServiceImpl implements PlatService {

    private final PlatRepositories platRepositories;
    private final CategoriePlatRepositories categoriePlatRepositories;

    public PlatServiceImpl(PlatRepositories platRepositories, CategoriePlatRepositories categoriePlatRepositories) {
        this.platRepositories = platRepositories;
        this.categoriePlatRepositories = categoriePlatRepositories;
    }

    @Override
    public List<Plat> getAllPlats() {
        return platRepositories.findAll();
    }

    @Override
    public Plat getPlatById(Long id) {
        return platRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat introuvable avec ID : " + id));
    }

    @Override
    public Plat createPlat(Plat plat) {
        // Gérer la catégorie si elle est fournie
        if (plat.getCategorie() != null && plat.getCategorie().getId() != null) {
            CategoriePlat categorie = categoriePlatRepositories.findById(plat.getCategorie().getId())
                    .orElseThrow(() -> new RuntimeException("Catégorie introuvable avec ID : " + plat.getCategorie().getId()));
            plat.setCategorie(categorie);
        }
        return platRepositories.save(plat);
    }

    @Override
    public Plat updatePlat(Long id, Plat newData) {
        Plat existing = platRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat introuvable avec ID : " + id));

        if (newData.getNom() != null) existing.setNom(newData.getNom());
        if (newData.getDescription() != null) existing.setDescription(newData.getDescription());
        if (newData.getPrix() != 0) existing.setPrix(newData.getPrix());
        
        // Mise à jour de la catégorie
        if (newData.getCategorie() != null) {
            if (newData.getCategorie().getId() != null) {
                CategoriePlat categorie = categoriePlatRepositories.findById(newData.getCategorie().getId())
                        .orElseThrow(() -> new RuntimeException("Catégorie introuvable avec ID : " + newData.getCategorie().getId()));
                existing.setCategorie(categorie);
            } else {
                existing.setCategorie(null);
            }
        }

        return platRepositories.save(existing);
    }

    @Override
    public void deletePlat(Long id) {
        if (!platRepositories.existsById(id)) {
            throw new RuntimeException("Plat introuvable avec ID : " + id);
        }
        platRepositories.deleteById(id);
    }
}
