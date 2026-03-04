package com.ucao.radbackend.repositories;

import com.ucao.radbackend.entities.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepositories extends JpaRepository<Stock, Long> {
}
