package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Depense;
import com.ucao.radbackend.entities.Fournisseur;
import com.ucao.radbackend.repositories.DepenseRepositories;
import com.ucao.radbackend.repositories.FournisseurRepositories;
import com.ucao.radbackend.services.DepenseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DepenseServiceImpl implements DepenseService {
    
    private final DepenseRepositories depenseRepositories;
    private final FournisseurRepositories fournisseurRepositories;
    
    public DepenseServiceImpl(DepenseRepositories depenseRepositories, 
                              FournisseurRepositories fournisseurRepositories) {
        this.depenseRepositories = depenseRepositories;
        this.fournisseurRepositories = fournisseurRepositories;
    }
    
    @Override
    public List<Depense> getAllDepenses() {
        return depenseRepositories.findAll();
    }
    
    @Override
    public Depense getDepenseById(Long id) {
        return depenseRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Dépense introuvable avec ID : " + id));
    }
    
    @Override
    @Transactional
    public Depense createDepense(Depense depense) {
        if (depense.getDateDepense() == null) {
            depense.setDateDepense(LocalDateTime.now());
        }
        
        if (depense.getFournisseur() != null && depense.getFournisseur().getIdFournisseur() != null) {
            Fournisseur fournisseur = fournisseurRepositories.findById(depense.getFournisseur().getIdFournisseur())
                    .orElseThrow(() -> new RuntimeException("Fournisseur introuvable"));
            depense.setFournisseur(fournisseur);
        }
        
        return depenseRepositories.save(depense);
    }
    
    @Override
    @Transactional
    public Depense updateDepense(Long id, Depense newData) {
        Depense existing = depenseRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Dépense introuvable avec ID : " + id));
        
        if (newData.getLibelle() != null) {
            existing.setLibelle(newData.getLibelle());
        }
        if (newData.getMontant() != null) {
            existing.setMontant(newData.getMontant());
        }
        if (newData.getDescription() != null) {
            existing.setDescription(newData.getDescription());
        }
        if (newData.getTypeDepense() != null) {
            existing.setTypeDepense(newData.getTypeDepense());
        }
        if (newData.getDateDepense() != null) {
            existing.setDateDepense(newData.getDateDepense());
        }
        if (newData.getFournisseur() != null && newData.getFournisseur().getIdFournisseur() != null) {
            Fournisseur fournisseur = fournisseurRepositories.findById(newData.getFournisseur().getIdFournisseur())
                    .orElseThrow(() -> new RuntimeException("Fournisseur introuvable"));
            existing.setFournisseur(fournisseur);
        }
        
        return depenseRepositories.save(existing);
    }
    
    @Override
    @Transactional
    public void deleteDepense(Long id) {
        if (!depenseRepositories.existsById(id)) {
            throw new RuntimeException("Dépense introuvable avec ID : " + id);
        }
        depenseRepositories.deleteById(id);
    }
    
    @Override
    public Double getTotalDepensesBetween(LocalDateTime start, LocalDateTime end) {
        Double total = depenseRepositories.getTotalDepensesBetween(start, end);
        return total != null ? total : 0.0;
    }
    
    @Override
    public List<Depense> getDepensesByType(Depense.TypeDepense type) {
        return depenseRepositories.findByTypeDepense(type);
    }
}





