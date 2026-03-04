package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepositories extends JpaRepository<Produit, Long> {
}
