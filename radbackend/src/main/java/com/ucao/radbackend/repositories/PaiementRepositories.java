package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaiementRepositories extends JpaRepository<Paiement, Long> {
}
