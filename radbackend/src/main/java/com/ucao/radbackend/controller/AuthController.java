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
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UtilisateurService utilisateurService;
    private final ClientService clientService;
    private final ClientRepositories clientRepositories;

    public AuthController(UtilisateurService utilisateurService, ClientService clientService, ClientRepositories clientRepositories) {
        this.utilisateurService = utilisateurService;
        this.clientService = clientService;
        this.clientRepositories = clientRepositories;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Nom d'utilisateur et mot de passe requis");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        Optional<Utilisateur> utilisateurOpt = utilisateurService.getUtilisateurByUsername(username);
        
        if (utilisateurOpt.isPresent() && utilisateurService.authenticate(username, password)) {
            Utilisateur utilisateur = utilisateurOpt.get();
            
            // Si c'est un client et qu'il n'a pas de Client associé, en créer un
            if (utilisateur.getRole() == Utilisateur.Role.CLIENT) {
                Optional<Client> clientOpt = clientRepositories.findByIdUtilisateur(utilisateur.getIdUtilisateur());
                if (clientOpt.isEmpty()) {
                    // Créer un Client associé si il n'existe pas
                    Client client = new Client();
                    client.setNom(utilisateur.getNom());
                    client.setPrenom(utilisateur.getPrenom());
                    client.setIdUtilisateur(utilisateur.getIdUtilisateur());
                    clientService.createClient(client);
                }
            }
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", utilisateur.getIdUtilisateur());
            userData.put("username", utilisateur.getUsername());
            userData.put("email", utilisateur.getEmail());
            userData.put("role", utilisateur.getRole().name());
            userData.put("nom", utilisateur.getNom());
            userData.put("prenom", utilisateur.getPrenom());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Connexion réussie");
            response.put("user", userData);
            
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Nom d'utilisateur ou mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> registrationData) {
        try {
            String username = registrationData.get("username");
            String password = registrationData.get("password");
            String email = registrationData.get("email");
            String nom = registrationData.get("nom");
            String prenom = registrationData.get("prenom");

            // Validation des champs requis
            if (username == null || username.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Le nom d'utilisateur est requis");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (password == null || password.trim().isEmpty() || password.length() < 4) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Le mot de passe doit contenir au moins 4 caractères");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (email == null || email.trim().isEmpty() || !email.contains("@")) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Une adresse email valide est requise");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (nom == null || nom.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Le nom est requis");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Créer le nouvel utilisateur avec le rôle CLIENT
            Utilisateur nouvelUtilisateur = new Utilisateur();
            nouvelUtilisateur.setUsername(username.trim());
            nouvelUtilisateur.setPassword(password); // En production, il faudrait hasher le mot de passe
            nouvelUtilisateur.setEmail(email.trim());
            nouvelUtilisateur.setNom(nom.trim());
            nouvelUtilisateur.setPrenom(prenom != null ? prenom.trim() : null);
            nouvelUtilisateur.setRole(Utilisateur.Role.CLIENT);
            nouvelUtilisateur.setActif(true);

            // Créer l'utilisateur
            Utilisateur utilisateurCree = utilisateurService.createUtilisateur(nouvelUtilisateur);

            // Si c'est un client, créer automatiquement un Client associé
            if (utilisateurCree.getRole() == Utilisateur.Role.CLIENT) {
                Client client = new Client();
                client.setNom(utilisateurCree.getNom());
                client.setPrenom(utilisateurCree.getPrenom());
                client.setIdUtilisateur(utilisateurCree.getIdUtilisateur());
                // Les autres champs peuvent être remplis plus tard
                clientService.createClient(client);
            }

            // Préparer la réponse
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", utilisateurCree.getIdUtilisateur());
            userData.put("username", utilisateurCree.getUsername());
            userData.put("email", utilisateurCree.getEmail());
            userData.put("role", utilisateurCree.getRole().name());
            userData.put("nom", utilisateurCree.getNom());
            userData.put("prenom", utilisateurCree.getPrenom());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Compte créé avec succès");
            response.put("user", userData);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Erreur lors de la création du compte : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

