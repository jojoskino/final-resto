package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.CommandeInterne;
import com.ucao.radbackend.entities.Fournisseur;
import com.ucao.radbackend.repositories.CommandeInterneRepositories;
import com.ucao.radbackend.repositories.FournisseurRepositories;
import com.ucao.radbackend.services.CommandeInterneService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommandeInterneServiceImpl implements CommandeInterneService {

    private final CommandeInterneRepositories commandeInterneRepositories;
    private final FournisseurRepositories fournisseurRepositories;

    public CommandeInterneServiceImpl(CommandeInterneRepositories commandeInterneRepositories,
                                      FournisseurRepositories fournisseurRepositories) {
        this.commandeInterneRepositories = commandeInterneRepositories;
        this.fournisseurRepositories = fournisseurRepositories;
    }

    @Override
    public List<CommandeInterne> getAllCommandesInternes() {
        return commandeInterneRepositories.findAll();
    }

    @Override
    public CommandeInterne getCommandeInterneById(Long id) {
        return commandeInterneRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("CommandeInterne introuvable avec ID : " + id));
    }

    @Override
    public CommandeInterne createCommandeInterne(CommandeInterne commandeInterne) {
        if (commandeInterne.getFournisseur() != null && commandeInterne.getFournisseur().getIdFournisseur() != null) {
            Fournisseur fournisseur = fournisseurRepositories.findById(
                            commandeInterne.getFournisseur().getIdFournisseur())
                    .orElseThrow(() -> new RuntimeException("Fournisseur introuvable pour la commande interne"));
            commandeInterne.setFournisseur(fournisseur);
        }
        return commandeInterneRepositories.save(commandeInterne);
    }

    @Override
    public CommandeInterne updateCommandeInterne(Long id, CommandeInterne newData) {
        CommandeInterne existing = commandeInterneRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("CommandeInterne introuvable avec ID : " + id));

        if (newData.getDate() != null) existing.setDate(newData.getDate());
        if (newData.getEtat() != null) existing.setEtat(newData.getEtat());

        if (newData.getFournisseur() != null && newData.getFournisseur().getIdFournisseur() != null) {
            Fournisseur fournisseur = fournisseurRepositories.findById(newData.getFournisseur().getIdFournisseur())
                    .orElseThrow(() -> new RuntimeException("Fournisseur introuvable pour mise à jour"));
            existing.setFournisseur(fournisseur);
        }

        return commandeInterneRepositories.save(existing);
    }

    @Override
    public void deleteCommandeInterne(Long id) {
        if (!commandeInterneRepositories.existsById(id)) {
            throw new RuntimeException("CommandeInterne introuvable avec ID : " + id);
        }
        commandeInterneRepositories.deleteById(id);
    }
}
