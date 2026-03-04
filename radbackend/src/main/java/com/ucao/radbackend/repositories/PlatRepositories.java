package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Plat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatRepositories extends JpaRepository<Plat, Long> {
}
