package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuRepositories extends JpaRepository<Menu, Long> {
}
