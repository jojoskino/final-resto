package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FournisseurRepositories extends JpaRepository<Fournisseur, Long> {
}
