package com.ucao.radbackend.controller;

import com.ucao.radbackend.dto.CommandeRequest;
import com.ucao.radbackend.dto.CommandeResponse;
import com.ucao.radbackend.entities.Client;
import com.ucao.radbackend.entities.Commande;
import com.ucao.radbackend.repositories.ClientRepositories;
import com.ucao.radbackend.services.CommandeService;
import com.ucao.radbackend.services.impl.CommandeServiceImpl;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
    
@RestController
@RequestMapping("/api/commandes")
@CrossOrigin
public class CommandeController {

    private final CommandeService commandeService;
    private final CommandeServiceImpl commandeServiceImpl;
    private final ClientRepositories clientRepositories;

    public CommandeController(CommandeService commandeService, CommandeServiceImpl commandeServiceImpl, ClientRepositories clientRepositories) {
        this.commandeService = commandeService;
        this.commandeServiceImpl = commandeServiceImpl;
        this.clientRepositories = clientRepositories;
    }

    @GetMapping
    public List<CommandeResponse> getAll() {
        return commandeService.getAllCommandes().stream()
                .map(this::toCommandeResponse)
                .collect(Collectors.toList());
    }

    private CommandeResponse toCommandeResponse(Commande commande) {
        CommandeResponse response = new CommandeResponse();
        response.setIdCommande(commande.getIdCommande());
        response.setDateCommande(commande.getDateCommande());
        response.setStatut(commande.getStatut() != null ? commande.getStatut().name() : Commande.StatutCommande.EN_ATTENTE.name());
        
        if (commande.getClient() != null) {
            CommandeResponse.ClientDTO clientDTO = new CommandeResponse.ClientDTO();
            clientDTO.setIdClient(commande.getClient().getIdClient());
            clientDTO.setNom(commande.getClient().getNom());
            clientDTO.setPrenom(commande.getClient().getPrenom());
            clientDTO.setTelephone(commande.getClient().getTelephone());
            response.setClient(clientDTO);
        }
        
        if (commande.getLignesCommande() != null) {
            List<CommandeResponse.LigneCommandeDTO> lignesDTO = commande.getLignesCommande().stream()
                    .map(ligne -> {
                        CommandeResponse.LigneCommandeDTO ligneDTO = new CommandeResponse.LigneCommandeDTO();
                        ligneDTO.setIdLigne(ligne.getIdLigne());
                        ligneDTO.setQuantite(ligne.getQuantite());
                        ligneDTO.setPrixUnitaire(ligne.getPrixUnitaire());
                        
                        if (ligne.getPlat() != null) {
                            CommandeResponse.PlatDTO platDTO = new CommandeResponse.PlatDTO();
                            platDTO.setIdPlat(ligne.getPlat().getIdPlat());
                            platDTO.setNom(ligne.getPlat().getNom());
                            platDTO.setPrix(ligne.getPlat().getPrix());
                            ligneDTO.setPlat(platDTO);
                        }
                        
                        return ligneDTO;
                    })
                    .collect(Collectors.toList());
            response.setLignesCommande(lignesDTO);
        }
        
        return response;
    }

    @GetMapping("/{id}")
    public CommandeResponse getById(@PathVariable Long id) {
        Commande commande = commandeService.getCommandeById(id);
        return toCommandeResponse(commande);
    }

    @GetMapping("/client/{utilisateurId}")
    public List<CommandeResponse> getByUtilisateurId(@PathVariable Long utilisateurId) {
        // Trouver le client associé à l'utilisateur
        Client client = clientRepositories.findByIdUtilisateur(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Client introuvable pour l'utilisateur ID: " + utilisateurId));
        
        // Récupérer les commandes du client
        List<Commande> commandes = commandeService.getCommandesByClientId(client.getIdClient());
        
        return commandes.stream()
                .map(this::toCommandeResponse)
                .collect(Collectors.toList());
    }

    @PostMapping
    public CommandeResponse create(@RequestBody CommandeRequest request) {
        // Validation supplémentaire
        if (request.getUtilisateurId() != null && request.getUtilisateurId() <= 0) {
            throw new RuntimeException("ID utilisateur invalide");
        }
        
        Commande commande = commandeServiceImpl.createCommandeFromRequest(request);
        
        // Vérification finale que la commande est bien associée au bon client
        if (commande.getClient() == null) {
            throw new RuntimeException("Erreur : la commande n'a pas de client associé");
        }
        
        // Si utilisateurId était fourni, vérifier la cohérence
        if (request.getUtilisateurId() != null && !request.getUtilisateurId().equals(commande.getClient().getIdUtilisateur())) {
            throw new RuntimeException("Erreur : incohérence entre l'utilisateur et le client de la commande");
        }
        
        return toCommandeResponse(commande);
    }

    @PutMapping("/{id}")
    public Commande update(@PathVariable Long id, @RequestBody Commande commande) {
        return commandeService.updateCommande(id, commande);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        commandeService.deleteCommande(id);
    }

    @PatchMapping("/{id}/statut")
    public CommandeResponse updateStatut(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String nouveauStatut = request.get("statut");
        if (nouveauStatut == null) {
            throw new RuntimeException("Le statut est requis");
        }
        
        Commande commande = commandeService.getCommandeById(id);
        try {
            Commande.StatutCommande statut = Commande.StatutCommande.valueOf(nouveauStatut.toUpperCase());
            commande.setStatut(statut);
            Commande commandeMiseAJour = commandeService.updateCommande(id, commande);
            return toCommandeResponse(commandeMiseAJour);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide: " + nouveauStatut);
        }
    }
}
