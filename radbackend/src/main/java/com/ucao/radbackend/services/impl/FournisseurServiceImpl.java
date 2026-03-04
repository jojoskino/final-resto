package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Fournisseur;
import com.ucao.radbackend.repositories.FournisseurRepositories;
import com.ucao.radbackend.services.FournisseurService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepositories fournisseurRepositories;

    public FournisseurServiceImpl(FournisseurRepositories fournisseurRepositories) {
        this.fournisseurRepositories = fournisseurRepositories;
    }

    @Override
    public List<Fournisseur> getAllFournisseurs() {
        return fournisseurRepositories.findAll();
    }

    @Override
    public Fournisseur getFournisseurById(Long id) {
        return fournisseurRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur introuvable avec ID : " + id));
    }

    @Override
    public Fournisseur createFournisseur(Fournisseur fournisseur) {
        return fournisseurRepositories.save(fournisseur);
    }

    @Override
    public Fournisseur updateFournisseur(Long id, Fournisseur newData) {
        Fournisseur existing = fournisseurRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur introuvable avec ID : " + id));

        if (newData.getNom() != null) existing.setNom(newData.getNom());
        if (newData.getContact() != null) existing.setContact(newData.getContact());

        return fournisseurRepositories.save(existing);
    }

    @Override
    public void deleteFournisseur(Long id) {
        if (!fournisseurRepositories.existsById(id)) {
            throw new RuntimeException("Fournisseur introuvable avec ID : " + id);
        }
        fournisseurRepositories.deleteById(id);
    }
}
