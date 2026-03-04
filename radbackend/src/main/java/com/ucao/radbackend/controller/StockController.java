package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.Stock;
import com.ucao.radbackend.services.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<Stock> getAll() {
        return stockService.getAllStocks();
    }

    @GetMapping("/{id}")
    public Stock getById(@PathVariable Long id) {
        return stockService.getStockById(id);
    }

    @PostMapping
    public Stock create(@RequestBody Stock stock) {
        return stockService.createStock(stock);
    }

    @PutMapping("/{id}")
    public Stock update(@PathVariable Long id, @RequestBody Stock stock) {
        return stockService.updateStock(id, stock);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        stockService.deleteStock(id);
    }
}
