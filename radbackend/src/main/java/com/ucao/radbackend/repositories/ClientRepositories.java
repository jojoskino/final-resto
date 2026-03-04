package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepositories extends JpaRepository<Client, Long> {
    @Query("SELECT c FROM Client c WHERE c.idUtilisateur = :idUtilisateur")
    Optional<Client> findByIdUtilisateur(@Param("idUtilisateur") Long idUtilisateur);
}
