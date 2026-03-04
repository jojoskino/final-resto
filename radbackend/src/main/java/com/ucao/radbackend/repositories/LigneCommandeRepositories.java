package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.LigneCommande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LigneCommandeRepositories extends JpaRepository<LigneCommande, Long> {
}
