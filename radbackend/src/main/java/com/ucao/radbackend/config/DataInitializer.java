package com.ucao.radbackend.config;

import com.ucao.radbackend.entities.CategoriePlat;
import com.ucao.radbackend.entities.Commande;
import com.ucao.radbackend.entities.Plat;
import com.ucao.radbackend.entities.Utilisateur;
import com.ucao.radbackend.repositories.CategoriePlatRepositories;
import com.ucao.radbackend.repositories.CommandeRepositories;
import com.ucao.radbackend.repositories.PlatRepositories;
import com.ucao.radbackend.repositories.UtilisateurRepositories;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final PlatRepositories platRepositories;
    private final UtilisateurRepositories utilisateurRepositories;
    private final CategoriePlatRepositories categoriePlatRepositories;
    private final CommandeRepositories commandeRepositories;

    public DataInitializer(PlatRepositories platRepositories, 
                          UtilisateurRepositories utilisateurRepositories,
                          CategoriePlatRepositories categoriePlatRepositories,
                          CommandeRepositories commandeRepositories) {
        this.platRepositories = platRepositories;
        this.utilisateurRepositories = utilisateurRepositories;
        this.categoriePlatRepositories = categoriePlatRepositories;
        this.commandeRepositories = commandeRepositories;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialisation des catégories
        CategoriePlat entree, plat, dessert, boisson;
        if (categoriePlatRepositories.count() == 0) {
            System.out.println("Initialisation des catégories dans la base de données...");
            
            entree = categoriePlatRepositories.save(
                CategoriePlat.builder()
                    .nom("Entrées")
                    .description("Nos délicieuses entrées pour commencer votre repas")
                    .build()
            );
            
            plat = categoriePlatRepositories.save(
                CategoriePlat.builder()
                    .nom("Plats")
                    .description("Nos plats principaux, spécialités du restaurant")
                    .build()
            );
            
            dessert = categoriePlatRepositories.save(
                CategoriePlat.builder()
                    .nom("Desserts")
                    .description("Nos desserts pour terminer votre repas en douceur")
                    .build()
            );
            
            boisson = categoriePlatRepositories.save(
                CategoriePlat.builder()
                    .nom("Boissons")
                    .description("Nos boissons fraîches et rafraîchissantes")
                    .build()
            );
            
            System.out.println("✅ " + categoriePlatRepositories.count() + " catégories ont été créées avec succès!");
        } else {
            System.out.println("ℹ️  Des catégories existent déjà dans la base de données (" + categoriePlatRepositories.count() + " catégories).");
            // Récupérer les catégories existantes
            entree = categoriePlatRepositories.findByNom("Entrées")
                .orElse(categoriePlatRepositories.findAll().stream()
                    .filter(c -> c.getNom().equalsIgnoreCase("Entrées"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Catégorie Entrées introuvable")));
            plat = categoriePlatRepositories.findByNom("Plats")
                .orElse(categoriePlatRepositories.findAll().stream()
                    .filter(c -> c.getNom().equalsIgnoreCase("Plats"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Catégorie Plats introuvable")));
            dessert = categoriePlatRepositories.findByNom("Desserts")
                .orElse(categoriePlatRepositories.findAll().stream()
                    .filter(c -> c.getNom().equalsIgnoreCase("Desserts"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Catégorie Desserts introuvable")));
            boisson = categoriePlatRepositories.findByNom("Boissons")
                .orElse(categoriePlatRepositories.findAll().stream()
                    .filter(c -> c.getNom().equalsIgnoreCase("Boissons"))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Catégorie Boissons introuvable")));
        }

        // Vérifier si des plats existent déjà
        if (platRepositories.count() == 0) {
            System.out.println("Initialisation des plats dans la base de données...");

            // Entrées
            platRepositories.save(new Plat(null, "Pastels", 
                "Beignets farcis au poisson ou à la viande", 1500.0, null, entree));
            
            platRepositories.save(new Plat(null, "Accras de Morue", 
                "Beignets de morue épicés", 2000.0, null, entree));
            
            platRepositories.save(new Plat(null, "Salade César", 
                "Salade fraîche avec poulet grillé", 2800.0, null, entree));
            
            // Plats principaux
            platRepositories.save(new Plat(null, "Poulet Yassa", 
                "Poulet mariné aux oignons et citron, spécialité sénégalaise", 4500.0, null, plat));
            
            platRepositories.save(new Plat(null, "Thiébou Djeun", 
                "Riz au poisson, plat national du Sénégal", 5000.0, null, plat));
            
            platRepositories.save(new Plat(null, "Mafé", 
                "Viande ou poisson dans une sauce à base d'arachide", 4800.0, null, plat));
            
            platRepositories.save(new Plat(null, "Couscous", 
                "Semoule accompagnée de légumes et viande", 4200.0, null, plat));
            
            platRepositories.save(new Plat(null, "Soupe Kandja", 
                "Soupe aux feuilles de gombo et poisson", 3500.0, null, plat));
            
            platRepositories.save(new Plat(null, "Riz au Gras", 
                "Riz cuit dans un bouillon de viande épicé", 4000.0, null, plat));
            
            platRepositories.save(new Plat(null, "Dibi", 
                "Brochettes de viande grillée, spécialité sénégalaise", 3000.0, null, plat));
            
            platRepositories.save(new Plat(null, "Caldou", 
                "Soupe de poisson aux légumes", 3800.0, null, plat));
            
            platRepositories.save(new Plat(null, "Thiéré", 
                "Couscous de mil aux légumes", 3500.0, null, plat));
            
            platRepositories.save(new Plat(null, "Boulettes de Poisson", 
                "Boulettes de poisson frites avec sauce tomate", 3200.0, null, plat));
            
            platRepositories.save(new Plat(null, "Pizza Margherita", 
                "Pizza classique tomate, mozzarella, basilic", 4500.0, null, plat));
            
            platRepositories.save(new Plat(null, "Burger Classique", 
                "Burger avec steak, salade, tomate, oignons", 3500.0, null, plat));
            
            platRepositories.save(new Plat(null, "Spaghetti Carbonara", 
                "Pâtes à la crème, lardons, parmesan", 4200.0, null, plat));
            
            platRepositories.save(new Plat(null, "Grillade Mixte", 
                "Assortiment de viandes grillées", 5500.0, null, plat));
            
            platRepositories.save(new Plat(null, "Poisson Braisé", 
                "Poisson entier grillé au charbon", 5000.0, null, plat));
            
            // Desserts
            platRepositories.save(new Plat(null, "Salade de Fruits", 
                "Assortiment de fruits frais de saison", 2000.0, null, dessert));
            
            platRepositories.save(new Plat(null, "Tiramisu", 
                "Dessert italien au café et mascarpone", 2500.0, null, dessert));
            
            // Boissons
            platRepositories.save(new Plat(null, "Jus de Bissap", 
                "Boisson rafraîchissante à l'hibiscus", 800.0, null, boisson));
            
            platRepositories.save(new Plat(null, "Jus de Gingembre", 
                "Boisson épicée et énergisante", 900.0, null, boisson));

            System.out.println("✅ " + platRepositories.count() + " plats ont été créés avec succès!");
        } else {
            System.out.println("ℹ️  Des plats existent déjà dans la base de données (" + platRepositories.count() + " plats).");
        }

        // Initialisation des utilisateurs
        if (utilisateurRepositories.count() == 0) {
            System.out.println("Initialisation des utilisateurs dans la base de données...");
            
            utilisateurRepositories.save(new Utilisateur(null, "admin", "admin123", 
                "admin@radresto.sn", Utilisateur.Role.ADMIN, "Administrateur", "Système", true));
            
            utilisateurRepositories.save(new Utilisateur(null, "gestion", "gest123", 
                "gestion@radresto.sn", Utilisateur.Role.GESTIONNAIRE, "Gestionnaire", "Restaurant", true));
            
            utilisateurRepositories.save(new Utilisateur(null, "serveur", "serv123", 
                "serveur@radresto.sn", Utilisateur.Role.SERVEUR, "Serveur", "Équipe", true));
            
            System.out.println("✅ " + utilisateurRepositories.count() + " utilisateurs ont été créés avec succès!");
        } else {
            System.out.println("ℹ️  Des utilisateurs existent déjà dans la base de données (" + utilisateurRepositories.count() + " utilisateurs).");
        }

        // Initialiser le statut des commandes existantes qui n'en ont pas
        long commandesSansStatut = commandeRepositories.findAll().stream()
            .filter(c -> c.getStatut() == null)
            .peek(c -> c.setStatut(Commande.StatutCommande.EN_ATTENTE))
            .count();
        
        if (commandesSansStatut > 0) {
            System.out.println("Initialisation du statut pour " + commandesSansStatut + " commande(s) existante(s)...");
            commandeRepositories.findAll().stream()
                .filter(c -> c.getStatut() == null)
                .forEach(c -> {
                    c.setStatut(Commande.StatutCommande.EN_ATTENTE);
                    commandeRepositories.save(c);
                });
            System.out.println("✅ Statut initialisé pour " + commandesSansStatut + " commande(s).");
        }
    }
}

