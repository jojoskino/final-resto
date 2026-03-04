package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.CategoriePlat;
import java.util.List;

public interface CategoriePlatService {

    List<CategoriePlat> getAllCategories();

    CategoriePlat getCategorieById(Long id);

    CategoriePlat createCategorie(CategoriePlat categoriePlat);

    CategoriePlat updateCategorie(Long id, CategoriePlat categoriePlat);

    void deleteCategorie(Long id);
}
