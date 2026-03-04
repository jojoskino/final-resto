package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Livraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LivraisonRepositories extends JpaRepository<Livraison, Long> {
}
