package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.Stock;
import java.util.List;

public interface StockService {

    List<Stock> getAllStocks();

    Stock getStockById(Long id);

    Stock createStock(Stock stock);

    Stock updateStock(Long id, Stock stock);

    void deleteStock(Long id);
}
