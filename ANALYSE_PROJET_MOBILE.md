# Analyse Complète du Projet - Version Mobile Flutter

## 🎨 DESIGN & IDENTITÉ VISUELLE

### Palette de Couleurs
- **Fond principal** : `#1A1A1A` (Noir très foncé)
- **Fond secondaire** : `#2A2A2A` (Gris foncé)
- **Couleur primaire** : `#FFA500` (Orange)
- **Couleur primaire hover** : `#FFB347`, `#FFC966`
- **Couleur accent** : `#FF6B35` (Orange rougeâtre)
- **Texte principal** : `#FFFFFF` (Blanc)
- **Texte secondaire** : `#999999` (Gris clair)
- **Texte tertiaire** : `#CCCCCC` (Gris moyen)

### Typographie
- **Titres** : `'Playfair Display'` (serif) - Poids 300, 400, 600, 700
- **Corps de texte** : `'Inter'` ou `'Segoe UI'` (sans-serif) - Poids 300, 400, 500, 600, 700

### Éléments de Design
- **Boutons** : Dégradés orange (`linear-gradient(135deg, #FFA500 0%, #FFB347 100%)`)
- **Bordures** : `rgba(255, 165, 0, 0.1)` à `rgba(255, 165, 0, 0.4)`
- **Ombres** : `rgba(255, 165, 0, 0.15)` à `rgba(255, 165, 0, 0.4)`
- **Border-radius** : 12px, 16px, 20px, 24px, 50px (boutons ronds)
- **Transitions** : `0.2s ease` à `0.4s cubic-bezier`

### Composants UI Récurrents
1. **Cartes** : Fond `#2A2A2A`, bordure orange transparente, hover avec glow orange
2. **Boutons primaires** : Dégradé orange, texte blanc, ombre orange
3. **Boutons secondaires** : Transparent avec bordure orange
4. **Inputs** : Fond `#1A1A1A`, bordure orange, focus avec glow
5. **Modals** : Fond `#2A2A2A`, backdrop blur, bordure orange

---

## 📱 PAGES & FONCTIONNALITÉS

### 1. Page d'Accueil (`/`)
**Composants** :
- Hero section avec image de fond et titre animé
- Section "Notre Cadre" (galerie d'images)
- Section "À Propos" (texte + image chef)
- Section "Features" (3 cartes avec icônes)

**Fonctionnalités** :
- Navigation vers Menu et Réservation
- Images avec overlay au hover
- Animations de points décoratifs

### 2. Page Menu (`/menu`)
**Composants** :
- Header avec titre et description
- Filtres par catégorie (boutons)
- Grille de cartes de plats
- Modal de détails du plat

**Fonctionnalités** :
- Filtrage par catégorie
- Affichage des plats avec image, nom, description, prix
- Ajout au panier depuis la carte ou le modal
- Badge de catégorie sur l'image
- Overlay au hover avec bouton "Voir détails"

**Données** :
- Liste des plats depuis `/api/plats`
- Liste des catégories depuis `/api/categories`
- Image par défaut si `imageUrl` manquant

### 3. Panier (Composant flottant)
**Composants** :
- FAB (Floating Action Button) avec badge de quantité
- Sidebar coulissante depuis la droite
- Liste des items avec contrôles de quantité
- Total et bouton de commande

**Fonctionnalités** :
- Ajout/retrait de plats
- Modification de quantité
- Calcul du total
- Vider le panier (avec confirmation)
- Commande (nécessite connexion)
- Stockage local du panier

### 4. Page Réservation (`/reservation`)
**Composants** :
- Formulaire de réservation
- Sélection de date, heure, nombre de personnes
- Champs : nom, email, téléphone, commentaires

**Fonctionnalités** :
- Validation du formulaire
- Date minimale = aujourd'hui
- Heures disponibles (11h-22h par tranches de 30min)
- Envoi (actuellement simulé)

### 5. Page Historique (`/historique`)
**Composants** :
- Liste des commandes du client
- Carte par commande avec détails
- Affichage des lignes de commande

**Fonctionnalités** :
- Chargement des commandes depuis `/api/commandes/client/{utilisateurId}`
- Tri par date décroissante
- Calcul du total par commande
- Formatage des dates

### 6. Authentification
**Composants** :
- Modal de connexion
- Modal d'inscription
- Header avec menu utilisateur

**Fonctionnalités** :
- Login : `/api/auth/login` (POST)
- Register : `/api/auth/register` (POST)
- Stockage de l'utilisateur dans localStorage
- Gestion des rôles (ADMIN, GESTIONNAIRE, SERVEUR, CLIENT)
- Redirection selon le rôle

### 7. Header
**Composants** :
- Logo "Le RadResto"
- Menu de navigation (Accueil, Menu, Galerie, Contact)
- Bouton "Réserver"
- Section authentification

**Fonctionnalités** :
- Navigation active (highlight)
- Menu utilisateur déroulant
- Accès admin pour ADMIN/GESTIONNAIRE/SERVEUR
- Déconnexion avec confirmation

### 8. Footer
**Composants** :
- 3 colonnes : À propos, Horaires, Contact
- Copyright

---

## 🔌 API BACKEND

### Base URL
- Développement : `http://localhost:8080/api`
- Mobile Android Emulator : `http://10.0.2.2:8080/api`
- Mobile iOS Simulator : `http://localhost:8080/api`
- Mobile Appareil physique : `http://VOTRE_IP_LOCALE:8080/api`

### Endpoints Principaux

#### Authentification
- `POST /api/auth/login`
  - Body: `{ username, password }`
  - Response: `{ message, user: { id, username, email, role, nom, prenom } }`

- `POST /api/auth/register`
  - Body: `{ username, password, email, nom, prenom? }`
  - Response: `{ message, user: {...} }`

#### Plats
- `GET /api/plats` - Liste de tous les plats
- `GET /api/plats/{id}` - Détails d'un plat
- `POST /api/plats` - Créer un plat (admin)
- `PUT /api/plats/{id}` - Modifier un plat (admin)
- `DELETE /api/plats/{id}` - Supprimer un plat (admin)

**Modèle Plat** :
```json
{
  "idPlat": 1,
  "nom": "Poulet Yassa",
  "description": "Description...",
  "prix": 5000.0,
  "imageUrl": "/uploads/...",
  "categorie": {
    "idCategorie": 1,
    "nom": "Plats principaux"
  }
}
```

#### Catégories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/{id}` - Détails d'une catégorie

**Modèle Categorie** :
```json
{
  "idCategorie": 1,
  "nom": "Plats principaux"
}
```

#### Commandes
- `GET /api/commandes` - Toutes les commandes (admin)
- `GET /api/commandes/{id}` - Détails d'une commande
- `GET /api/commandes/client/{utilisateurId}` - Commandes d'un client
- `POST /api/commandes` - Créer une commande
  - Body: `{ utilisateurId?, clientId?, lignesCommande: [{ platId, quantite, prixUnitaire }] }`
- `PATCH /api/commandes/{id}/statut` - Mettre à jour le statut
  - Body: `{ statut: "EN_ATTENTE" | "EN_PREPARATION" | "PRETE" | "EN_LIVRAISON" | "LIVREE" | "ANNULEE" }`

**Modèle Commande** :
```json
{
  "idCommande": 1,
  "dateCommande": "2025-01-15T10:30:00",
  "statut": "EN_ATTENTE",
  "client": {
    "idClient": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "+221..."
  },
  "lignesCommande": [
    {
      "idLigne": 1,
      "quantite": 2,
      "prixUnitaire": 5000.0,
      "plat": {
        "idPlat": 1,
        "nom": "Poulet Yassa",
        "prix": 5000.0
      }
    }
  ]
}
```

#### Clients
- `GET /api/clients` - Liste des clients (admin)
- `GET /api/clients/{id}` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client

---

## 📦 STRUCTURE DES DONNÉES

### Utilisateur
- `id` (Long)
- `username` (String)
- `email` (String)
- `role` (ADMIN | GESTIONNAIRE | SERVEUR | CLIENT)
- `nom` (String?)
- `prenom` (String?)

### Panier (Local Storage)
```typescript
interface ItemPanier {
  plat: Plat;
  quantite: number;
}
```

### Commande Request
```typescript
interface CommandeRequest {
  utilisateurId?: number;
  clientId?: number;
  lignesCommande: {
    platId: number;
    quantite: number;
    prixUnitaire: number;
  }[];
}
```

---

## 🎯 FONCTIONNALITÉS MOBILE À IMPLÉMENTER

### Priorité 1 (Essentiel)
1. ✅ Authentification (Login/Register)
2. ✅ Page d'accueil avec hero section
3. ✅ Page menu avec filtres
4. ✅ Panier avec FAB
5. ✅ Page historique des commandes
6. ✅ Création de commande

### Priorité 2 (Important)
7. Page réservation
8. Page contact
9. Page galerie
10. Profil utilisateur
11. Notifications push (optionnel)

### Priorité 3 (Optionnel)
12. Mode hors ligne (cache)
13. Recherche de plats
14. Favoris
15. Partage de plats

---

## 📐 ADAPTATION MOBILE

### Responsive Design
- **Desktop** : Grid 3 colonnes, sidebar panier
- **Tablet** : Grid 2 colonnes, sidebar panier
- **Mobile** : Grid 1 colonne, panier fullscreen

### Navigation Mobile
- Bottom Navigation Bar (Accueil, Menu, Panier, Profil)
- Drawer menu pour navigation secondaire
- Header collapsible avec logo

### Interactions Tactiles
- Swipe pour fermer modals/panier
- Pull to refresh sur les listes
- Long press pour actions rapides
- Haptic feedback sur actions importantes

---

## 🔧 TECHNOLOGIES & PACKAGES FLUTTER

### Packages Essentiels
```yaml
dependencies:
  # HTTP & API
  dio: ^5.4.0
  http: ^1.1.0
  
  # State Management
  provider: ^6.1.1
  
  # Local Storage
  shared_preferences: ^2.2.2
  
  # JSON
  json_annotation: ^4.8.1
  
  # UI
  cached_network_image: ^3.3.0
  flutter_svg: ^2.0.9
  google_fonts: ^6.1.0  # Pour Playfair Display et Inter
  
  # Navigation
  go_router: ^13.0.0
  
  # Utils
  intl: ^0.19.0
  uuid: ^4.2.1
  flutter_animate: ^4.3.0  # Pour animations

dev_dependencies:
  build_runner: ^2.4.7
  json_serializable: ^6.7.1
```

---

## 📝 NOTES IMPORTANTES

1. **CORS** : Le backend a `@CrossOrigin` sur tous les controllers
2. **Authentification** : Pas de JWT actuellement, utiliser localStorage
3. **Images** : URLs relatives ou absolues depuis le backend
4. **Devise** : FCFA (Franc CFA)
5. **Langue** : Français (tous les textes)
6. **Format de date** : ISO 8601 côté API, format français côté UI

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ Analyser le projet (FAIT)
2. ⏳ Vérifier/Installer Flutter
3. ⏳ Créer la structure du projet Flutter
4. ⏳ Implémenter les modèles de données
5. ⏳ Créer les services API
6. ⏳ Implémenter l'authentification
7. ⏳ Créer les écrans principaux
8. ⏳ Adapter le design mobile
9. ⏳ Tester sur émulateur/appareil
10. ⏳ Optimiser et finaliser

