package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.CommandeInterne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommandeInterneRepositories extends JpaRepository<CommandeInterne, Long> {
}
