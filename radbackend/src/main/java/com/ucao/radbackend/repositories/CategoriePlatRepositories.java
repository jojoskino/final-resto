package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.CategoriePlat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriePlatRepositories extends JpaRepository<CategoriePlat, Long> {
    Optional<CategoriePlat> findByNom(String nom);
}
