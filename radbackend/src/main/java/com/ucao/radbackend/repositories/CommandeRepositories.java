package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommandeRepositories extends JpaRepository<Commande, Long> {
    List<Commande> findByDateCommandeBetween(LocalDateTime start, LocalDateTime end);
    List<Commande> findByClient_IdClient(Long idClient);
}
