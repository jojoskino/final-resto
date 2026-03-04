package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Utilisateur;
import com.ucao.radbackend.repositories.UtilisateurRepositories;
import com.ucao.radbackend.services.UtilisateurService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepositories utilisateurRepositories;

    public UtilisateurServiceImpl(UtilisateurRepositories utilisateurRepositories) {
        this.utilisateurRepositories = utilisateurRepositories;
    }

    @Override
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepositories.findAll();
    }

    @Override
    public Optional<Utilisateur> getUtilisateurById(Long id) {
        return utilisateurRepositories.findById(id);
    }

    @Override
    public Optional<Utilisateur> getUtilisateurByUsername(String username) {
        return utilisateurRepositories.findByUsername(username);
    }

    @Override
    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        if (utilisateurRepositories.existsByUsername(utilisateur.getUsername())) {
            throw new RuntimeException("Le nom d'utilisateur existe déjà");
        }
        if (utilisateurRepositories.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("L'email existe déjà");
        }
        return utilisateurRepositories.save(utilisateur);
    }

    @Override
    public Utilisateur updateUtilisateur(Long id, Utilisateur utilisateur) {
        Utilisateur existing = utilisateurRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        if (!existing.getUsername().equals(utilisateur.getUsername()) 
            && utilisateurRepositories.existsByUsername(utilisateur.getUsername())) {
            throw new RuntimeException("Le nom d'utilisateur existe déjà");
        }
        if (!existing.getEmail().equals(utilisateur.getEmail()) 
            && utilisateurRepositories.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("L'email existe déjà");
        }
        
        utilisateur.setIdUtilisateur(id);
        return utilisateurRepositories.save(utilisateur);
    }

    @Override
    public void deleteUtilisateur(Long id) {
        utilisateurRepositories.deleteById(id);
    }

    @Override
    public boolean authenticate(String username, String password) {
        Optional<Utilisateur> utilisateurOpt = utilisateurRepositories.findByUsername(username);
        if (utilisateurOpt.isPresent()) {
            Utilisateur utilisateur = utilisateurOpt.get();
            // Pour l'instant, comparaison simple (à remplacer par BCrypt en production)
            return utilisateur.getActif() && utilisateur.getPassword().equals(password);
        }
        return false;
    }
}


