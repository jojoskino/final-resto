package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.Commande;
import java.util.List;

public interface CommandeService {

    List<Commande> getAllCommandes();

    Commande getCommandeById(Long id);
    
    List<Commande> getCommandesByClientId(Long clientId);

    Commande createCommande(Commande commande);

    Commande updateCommande(Long id, Commande commande);

    void deleteCommande(Long id);
}
