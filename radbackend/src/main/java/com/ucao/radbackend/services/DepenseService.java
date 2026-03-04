package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.Depense;
import java.time.LocalDateTime;
import java.util.List;

public interface DepenseService {
    List<Depense> getAllDepenses();
    Depense getDepenseById(Long id);
    Depense createDepense(Depense depense);
    Depense updateDepense(Long id, Depense depense);
    void deleteDepense(Long id);
    Double getTotalDepensesBetween(LocalDateTime start, LocalDateTime end);
    List<Depense> getDepensesByType(Depense.TypeDepense type);
}





