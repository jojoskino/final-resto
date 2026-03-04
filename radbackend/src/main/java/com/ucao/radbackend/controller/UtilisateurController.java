package com.ucao.radbackend.controller;

import com.ucao.radbackend.entities.Client;
import com.ucao.radbackend.entities.Utilisateur;
import com.ucao.radbackend.repositories.ClientRepositories;
import com.ucao.radbackend.services.ClientService;
import com.ucao.radbackend.services.UtilisateurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin
public class UtilisateurController {

    private final UtilisateurService utilisateurService;
    private final ClientService clientService;
    private final ClientRepositories clientRepositories;

    public UtilisateurController(UtilisateurService utilisateurService, ClientService clientService, ClientRepositories clientRepositories) {
        this.utilisateurService = utilisateurService;
        this.clientService = clientService;
        this.clientRepositories = clientRepositories;
    }

    @GetMapping
    public List<Utilisateur> getAll() {
        return utilisateurService.getAllUtilisateurs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getById(@PathVariable Long id) {
        Optional<Utilisateur> utilisateur = utilisateurService.getUtilisateurById(id);
        return utilisateur.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Utilisateur utilisateur) {
        try {
            // Validation
            if (utilisateur.getUsername() == null || utilisateur.getUsername().trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Le nom d'utilisateur est requis");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (utilisateur.getPassword() == null || utilisateur.getPassword().trim().isEmpty() || utilisateur.getPassword().length() < 4) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Le mot de passe doit contenir au moins 4 caractères");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (utilisateur.getEmail() == null || utilisateur.getEmail().trim().isEmpty() || !utilisateur.getEmail().contains("@")) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Une adresse email valide est requise");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (utilisateur.getRole() == null) {
                utilisateur.setRole(Utilisateur.Role.CLIENT);
            }

            if (utilisateur.getActif() == null) {
                utilisateur.setActif(true);
            }

            Utilisateur utilisateurCree = utilisateurService.createUtilisateur(utilisateur);

            // Si c'est un client, créer automatiquement un Client associé
            if (utilisateurCree.getRole() == Utilisateur.Role.CLIENT) {
                Optional<Client> clientExistant = clientRepositories.findByIdUtilisateur(utilisateurCree.getIdUtilisateur());
                if (clientExistant.isEmpty()) {
                    Client client = new Client();
                    client.setNom(utilisateurCree.getNom());
                    client.setPrenom(utilisateurCree.getPrenom());
                    client.setIdUtilisateur(utilisateurCree.getIdUtilisateur());
                    clientService.createClient(client);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur créé avec succès");
            response.put("utilisateur", utilisateurCree);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Erreur lors de la création de l'utilisateur : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Utilisateur utilisateur) {
        try {
            utilisateur.setIdUtilisateur(id);
            Utilisateur utilisateurMiseAJour = utilisateurService.updateUtilisateur(id, utilisateur);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur mis à jour avec succès");
            response.put("utilisateur", utilisateurMiseAJour);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Erreur lors de la mise à jour de l'utilisateur : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        try {
            utilisateurService.deleteUtilisateur(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur supprimé avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Erreur lors de la suppression de l'utilisateur : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

