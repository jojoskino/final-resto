package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Depense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DepenseRepositories extends JpaRepository<Depense, Long> {
    
    List<Depense> findByDateDepenseBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT SUM(d.montant) FROM Depense d WHERE d.dateDepense BETWEEN ?1 AND ?2")
    Double getTotalDepensesBetween(LocalDateTime start, LocalDateTime end);
    
    List<Depense> findByTypeDepense(Depense.TypeDepense type);
}





