package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.dto.CommandeRequest;
import com.ucao.radbackend.dto.LigneCommandeRequest;
import com.ucao.radbackend.entities.Client;
import com.ucao.radbackend.entities.Commande;
import com.ucao.radbackend.entities.LigneCommande;
import com.ucao.radbackend.entities.Plat;
import com.ucao.radbackend.entities.Utilisateur;
import com.ucao.radbackend.repositories.ClientRepositories;
import com.ucao.radbackend.repositories.CommandeRepositories;
import com.ucao.radbackend.repositories.LigneCommandeRepositories;
import com.ucao.radbackend.repositories.PlatRepositories;
import com.ucao.radbackend.repositories.UtilisateurRepositories;
import com.ucao.radbackend.services.CommandeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class CommandeServiceImpl implements CommandeService {

    private final CommandeRepositories commandeRepositories;
    private final ClientRepositories clientRepositories;
    private final LigneCommandeRepositories ligneCommandeRepositories;
    private final PlatRepositories platRepositories;
    private final UtilisateurRepositories utilisateurRepositories;

    public CommandeServiceImpl(CommandeRepositories commandeRepositories,
                               ClientRepositories clientRepositories,
                               LigneCommandeRepositories ligneCommandeRepositories,
                               PlatRepositories platRepositories,
                               UtilisateurRepositories utilisateurRepositories) {
        this.commandeRepositories = commandeRepositories;
        this.clientRepositories = clientRepositories;
        this.ligneCommandeRepositories = ligneCommandeRepositories;
        this.platRepositories = platRepositories;
        this.utilisateurRepositories = utilisateurRepositories;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Commande> getAllCommandes() {
        // Avec FetchType.EAGER, les relations sont chargées automatiquement
        return commandeRepositories.findAll();
    }

    @Override
    public Commande getCommandeById(Long id) {
        return commandeRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec ID : " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Commande> getCommandesByClientId(Long clientId) {
        return commandeRepositories.findByClient_IdClient(clientId);
    }

    @Override
    @Transactional
    public Commande createCommande(Commande commande) {
        // Si c'est une CommandeRequest, on la traite différemment
        if (commande.getDateCommande() == null) {
            commande.setDateCommande(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        // Vérifier que le client existe
        if (commande.getClient() != null && commande.getClient().getIdClient() != null) {
            Client client = clientRepositories.findById(commande.getClient().getIdClient())
                    .orElseThrow(() -> new RuntimeException("Client introuvable pour la commande"));
            commande.setClient(client);
        }

        Commande savedCommande = commandeRepositories.save(commande);

        // Sauvegarder les lignes de commande si elles existent
        if (commande.getLignesCommande() != null && !commande.getLignesCommande().isEmpty()) {
            for (LigneCommande ligne : commande.getLignesCommande()) {
                ligne.setCommande(savedCommande);
                if (ligne.getPlat() != null && ligne.getPlat().getIdPlat() != null) {
                    Plat plat = platRepositories.findById(ligne.getPlat().getIdPlat())
                            .orElseThrow(() -> new RuntimeException("Plat introuvable pour la ligne de commande"));
                    ligne.setPlat(plat);
                }
                ligneCommandeRepositories.save(ligne);
            }
        }

        return savedCommande;
    }

    @Transactional
    public Commande createCommandeFromRequest(CommandeRequest request) {
        if (request.getClientId() == null && request.getUtilisateurId() == null) {
            throw new RuntimeException("L'ID du client ou de l'utilisateur est requis");
        }
        
        if (request.getLignesCommande() == null || request.getLignesCommande().isEmpty()) {
            throw new RuntimeException("Au moins une ligne de commande est requise");
        }

        Commande commande = new Commande();
        commande.setDateCommande(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        commande.setStatut(Commande.StatutCommande.EN_ATTENTE);

        // Vérifier et assigner le client
        Client client;
        if (request.getClientId() != null) {
            // Si clientId est fourni, l'utiliser directement mais vérifier qu'il correspond à l'utilisateur si fourni
            client = clientRepositories.findById(request.getClientId())
                    .orElseThrow(() -> new RuntimeException("Client introuvable avec ID: " + request.getClientId()));
            
            // Vérifier que le client correspond bien à l'utilisateur si utilisateurId est fourni
            if (request.getUtilisateurId() != null && !request.getUtilisateurId().equals(client.getIdUtilisateur())) {
                throw new RuntimeException("Le client spécifié ne correspond pas à l'utilisateur");
            }
        } else {
            // Sinon, chercher le client par utilisateurId
            if (request.getUtilisateurId() == null) {
                throw new RuntimeException("L'ID de l'utilisateur est requis");
            }
            
            // Vérifier d'abord que l'utilisateur existe
            Optional<Utilisateur> utilisateurOpt = utilisateurRepositories.findById(request.getUtilisateurId());
            if (utilisateurOpt.isEmpty()) {
                throw new RuntimeException("Utilisateur introuvable avec ID: " + request.getUtilisateurId());
            }
            Utilisateur utilisateur = utilisateurOpt.get();
            
            // Vérifier que c'est bien un client
            if (utilisateur.getRole() != Utilisateur.Role.CLIENT) {
                throw new RuntimeException("Seuls les clients peuvent passer des commandes");
            }
            
            // Chercher le client associé
            Optional<Client> clientOpt = clientRepositories.findByIdUtilisateur(request.getUtilisateurId());
            if (clientOpt.isPresent()) {
                client = clientOpt.get();
                // Vérifier que le client correspond bien à l'utilisateur
                if (client.getIdUtilisateur() == null || !client.getIdUtilisateur().equals(utilisateur.getIdUtilisateur())) {
                    throw new RuntimeException("Incohérence détectée : le client trouvé (ID: " + client.getIdClient() + 
                        ", idUtilisateur: " + client.getIdUtilisateur() + 
                        ") ne correspond pas à l'utilisateur demandé (ID: " + utilisateur.getIdUtilisateur() + ")");
                }
                // Double vérification : s'assurer que le client n'appartient pas à un autre utilisateur
                if (!client.getIdUtilisateur().equals(request.getUtilisateurId())) {
                    throw new RuntimeException("Erreur de sécurité : tentative d'associer une commande au mauvais client");
                }
            } else {
                // Si le Client n'existe pas, le créer automatiquement
                Client nouveauClient = new Client();
                nouveauClient.setNom(utilisateur.getNom());
                nouveauClient.setPrenom(utilisateur.getPrenom());
                nouveauClient.setIdUtilisateur(utilisateur.getIdUtilisateur());
                client = clientRepositories.save(nouveauClient);
            }
        }
        commande.setClient(client);

        // Sauvegarder la commande d'abord
        Commande savedCommande = commandeRepositories.save(commande);

        // Créer les lignes de commande
        for (LigneCommandeRequest ligneReq : request.getLignesCommande()) {
            if (ligneReq.getPlatId() == null) {
                throw new RuntimeException("L'ID du plat est requis pour chaque ligne");
            }
            
            Plat plat = platRepositories.findById(ligneReq.getPlatId())
                    .orElseThrow(() -> new RuntimeException("Plat introuvable avec ID: " + ligneReq.getPlatId()));

            LigneCommande ligne = new LigneCommande();
            ligne.setCommande(savedCommande);
            ligne.setPlat(plat);
            ligne.setQuantite(ligneReq.getQuantite());
            
            // Utiliser le prix du plat si prixUnitaire n'est pas fourni
            if (ligneReq.getPrixUnitaire() > 0) {
                ligne.setPrixUnitaire(ligneReq.getPrixUnitaire());
            } else {
                ligne.setPrixUnitaire(plat.getPrix());
            }

            ligneCommandeRepositories.save(ligne);
        }

        // Recharger la commande avec toutes ses relations pour s'assurer qu'elles sont chargées
        Commande commandeComplete = commandeRepositories.findById(savedCommande.getIdCommande())
                .orElse(savedCommande);
        
        // Forcer le chargement des relations si nécessaire
        if (commandeComplete.getLignesCommande() != null) {
            commandeComplete.getLignesCommande().forEach(ligne -> {
                if (ligne.getPlat() != null) {
                    ligne.getPlat().getNom(); // Force le chargement
                }
            });
        }
        if (commandeComplete.getClient() != null) {
            commandeComplete.getClient().getNom(); // Force le chargement
        }
        
        return commandeComplete;
    }

    @Override
    public Commande updateCommande(Long id, Commande newData) {

        Commande existing = commandeRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande introuvable avec ID : " + id));

        if (newData.getDateCommande() != null) {
            existing.setDateCommande(newData.getDateCommande());
        }

        // Mise à jour du statut
        if (newData.getStatut() != null) {
            existing.setStatut(newData.getStatut());
        }

        // Mise à jour du Client
        if (newData.getClient() != null && newData.getClient().getIdClient() != null) {
            Client client = clientRepositories.findById(newData.getClient().getIdClient())
                    .orElseThrow(() -> new RuntimeException("Client introuvable pour mise à jour"));
            existing.setClient(client);
        }

        return commandeRepositories.save(existing);
    }

    @Override
    public void deleteCommande(Long id) {
        if (!commandeRepositories.existsById(id)) {
            throw new RuntimeException("Commande introuvable avec ID : " + id);
        }
        commandeRepositories.deleteById(id);
    }
}
