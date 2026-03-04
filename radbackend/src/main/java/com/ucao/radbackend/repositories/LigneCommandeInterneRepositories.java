package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.LigneCommandeInterne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LigneCommandeInterneRepositories extends JpaRepository<LigneCommandeInterne, Long> {
}
