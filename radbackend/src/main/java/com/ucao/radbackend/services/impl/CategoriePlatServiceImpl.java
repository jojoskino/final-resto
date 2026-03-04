package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.CategoriePlat;
import com.ucao.radbackend.repositories.CategoriePlatRepositories;
import com.ucao.radbackend.services.CategoriePlatService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriePlatServiceImpl implements CategoriePlatService {

    private final CategoriePlatRepositories categoriePlatRepositories;

    public CategoriePlatServiceImpl(CategoriePlatRepositories categoriePlatRepositories) {
        this.categoriePlatRepositories = categoriePlatRepositories;
    }

    @Override
    public List<CategoriePlat> getAllCategories() {
        return categoriePlatRepositories.findAll();
    }

    @Override
    public CategoriePlat getCategorieById(Long id) {
        return categoriePlatRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie introuvable avec ID : " + id));
    }

    @Override
    public CategoriePlat createCategorie(CategoriePlat categoriePlat) {
        return categoriePlatRepositories.save(categoriePlat);
    }

    @Override
    public CategoriePlat updateCategorie(Long id, CategoriePlat newData) {

        CategoriePlat existing = categoriePlatRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie introuvable avec ID : " + id));

        if (newData.getNom() != null) {
            existing.setNom(newData.getNom());
        }

        if (newData.getDescription() != null) {
            existing.setDescription(newData.getDescription());
        }

        return categoriePlatRepositories.save(existing);
    }

    @Override
    public void deleteCategorie(Long id) {
        if (!categoriePlatRepositories.existsById(id)) {
            throw new RuntimeException("Catégorie introuvable avec ID : " + id);
        }

        categoriePlatRepositories.deleteById(id);
    }
}
