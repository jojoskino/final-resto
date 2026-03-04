import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatService, Plat } from '../../services/plat.service';
import { PanierService } from '../../services/panier.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="menu-container">
      <div class="menu-header">
        <h1>
          <span class="title-white">Nos</span>
          <span class="title-orange">Plats</span>
        </h1>
        <p>Une sélection raffinée de plats préparés avec des ingrédients frais et de qualité, pour une expérience culinaire inoubliable.</p>
        
        <!-- Filtres -->
        <div class="filters">
          <button 
            *ngFor="let filter of filters" 
            [class.active]="filterActive === filter"
            (click)="setFilter(filter)"
            class="filter-btn">
            {{ filter }}
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement du menu...</p>
      </div>

      <div *ngIf="error" class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button class="btn-retry" (click)="chargerPlats()">
          <i class="fas fa-redo"></i> Réessayer
        </button>
      </div>

      <div class="plats-grid" *ngIf="!loading && !error">
        <div *ngFor="let plat of platsFiltres" class="plat-card">
          <div class="plat-image">
            <img [src]="getPlatImage(plat)" [alt]="plat.nom" (error)="onImageError($event)" />
            <div class="plat-badge" *ngIf="plat.categorie">{{ plat.categorie.nom }}</div>
            <div class="plat-overlay">
              <button class="btn-details" (click)="voirDetails(plat)">Voir détails →</button>
            </div>
          </div>
          <div class="plat-content">
            <h3>{{ plat.nom }}</h3>
            <div class="plat-categorie" *ngIf="plat.categorie">
              <i class="fas fa-tag"></i> {{ plat.categorie.nom }}
            </div>
            <p class="plat-description">{{ plat.description }}</p>
            <div class="plat-footer">
              <span class="plat-prix">{{ plat.prix | number }} FCFA</span>
              <button class="btn-ajouter" (click)="ajouterAuPanier(plat, $event)">
                <i class="fas fa-plus"></i> Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !error && platsFiltres.length === 0" class="empty">
        <p>Aucun plat disponible pour le moment.</p>
      </div>

      <!-- Modal détails -->
      <div class="modal-details" [class.open]="modalDetailsOpen" (click)="fermerDetails()">
        <div class="modal-details-content" (click)="$event.stopPropagation()">
          <button class="close-details" (click)="fermerDetails()"><i class="fas fa-times"></i></button>
          <div *ngIf="platSelectionne" class="details-content">
            <div class="details-image">
              <img [src]="getPlatImage(platSelectionne)" [alt]="platSelectionne.nom" (error)="onImageError($event)" />
            </div>
            <div class="details-info">
              <h2>{{ platSelectionne.nom }}</h2>
              <p class="details-description">{{ platSelectionne.description }}</p>
              <div class="details-categorie" *ngIf="platSelectionne.categorie">
                <i class="fas fa-tag"></i> {{ platSelectionne.categorie.nom }}
              </div>
              <div class="details-prix">
                <span class="prix-label">Prix:</span>
                <span class="prix-value">{{ platSelectionne.prix | number }} FCFA</span>
              </div>
              <button class="btn-ajouter-details" (click)="ajouterAuPanier(platSelectionne, $event); fermerDetails()">
                <i class="fas fa-plus"></i> Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 4rem 2rem;
      background: #1A1A1A;
      min-height: calc(100vh - 200px);
      color: white;
    }
    .menu-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    .menu-header h1 {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      font-family: 'Playfair Display', serif;
      font-weight: 400;
    }
    .title-white {
      color: white;
    }
    .title-orange {
      color: #FFA500;
    }
    .menu-header > p {
      color: #999;
      font-size: 1.2rem;
      font-weight: 300;
      max-width: 900px;
      margin: 0 auto 3rem;
      line-height: 1.8;
    }
    .filters {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 2rem;
    }
    .filter-btn {
      padding: 0.8rem 2rem;
      background: #2A2A2A;
      color: white;
      border: 1px solid rgba(255, 165, 0, 0.3);
      border-radius: 50px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s;
      font-size: 1rem;
    }
    .filter-btn:hover {
      border-color: #FFA500;
      background: rgba(255, 165, 0, 0.1);
    }
    .filter-btn.active {
      background: #FFA500;
      border-color: #FFA500;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
    }
    .plats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2.5rem;
    }
    .plat-card {
      background: #2A2A2A;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      border: 1px solid rgba(255, 165, 0, 0.1);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .plat-card:hover {
      border-color: rgba(255, 165, 0, 0.4);
      box-shadow: 0 8px 25px rgba(255, 165, 0, 0.15);
    }
    .plat-image {
      width: 100%;
      height: 280px;
      position: relative;
      overflow: hidden;
    }
    .plat-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .plat-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #FFA500;
      color: white;
      padding: 0.5rem 1.2rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      z-index: 2;
    }
    .plat-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 2rem;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .plat-card:hover .plat-overlay {
      opacity: 1;
    }
    .btn-details {
      background: transparent;
      color: white;
      border: 2px solid white;
      padding: 0.8rem 2rem;
      border-radius: 50px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }
    .btn-details:hover {
      background: white;
      color: #FFA500;
    }
    .plat-content {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .plat-content h3 {
      margin: 0 0 0.75rem;
      color: white;
      font-size: 1.6rem;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .plat-categorie {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #FFA500;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1rem;
      padding: 0.4rem 0.8rem;
      background: rgba(255, 165, 0, 0.1);
      border-radius: 8px;
      width: fit-content;
    }
    .plat-categorie i {
      font-size: 0.85rem;
    }
    .plat-description {
      color: #999;
      margin-bottom: 1.5rem;
      line-height: 1.8;
      font-size: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-grow: 1;
    }
    .plat-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 107, 53, 0.2);
    }
    .plat-prix {
      font-size: 1.2rem;
      font-weight: 700;
      color: #FFA500;
    }
    .btn-ajouter {
      padding: 0.8rem 1.5rem;
      background: #FFA500;
      color: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-ajouter:hover {
      background: #FFB347;
    }
    .loading {
      text-align: center;
      padding: 4rem;
      color: #999;
      font-size: 1.2rem;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 107, 53, 0.2);
      border-top-color: rgba(255, 165, 0, 0.2);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .error {
      color: #FFA500;
      background: rgba(255, 165, 0, 0.1);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      border: 1px solid rgba(255, 165, 0, 0.3);
    }
    .error i {
      font-size: 2rem;
      margin-bottom: 1rem;
      display: block;
    }
    .btn-retry {
      margin-top: 1rem;
      padding: 0.8rem 1.5rem;
      background: #FFA500;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }
    .btn-retry:hover {
      background: #FFB347;
    }
    .empty {
      background: rgba(255, 165, 0, 0.1);
      border-radius: 12px;
      padding: 3rem;
      text-align: center;
      border: 1px solid rgba(255, 165, 0, 0.3);
      color: #999;
    }
    .modal-details {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      backdrop-filter: blur(5px);
    }
    .modal-details.open {
      opacity: 1;
      visibility: visible;
    }
    .modal-details-content {
      background: #2A2A2A;
      border-radius: 20px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      border: 1px solid rgba(255, 107, 53, 0.2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    .close-details {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(255, 107, 53, 0.2);
      border: none;
      color: white;
      font-size: 1.5rem;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.2s ease;
    }
    .close-details:hover {
      background: #FFA500;
      transform: rotate(90deg);
    }
    .details-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding: 2rem;
    }
    .details-image {
      width: 100%;
      height: 400px;
      border-radius: 16px;
      overflow: hidden;
    }
    .details-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .details-info h2 {
      margin: 0 0 1rem;
      color: #FFA500;
      font-size: 2rem;
      font-weight: 700;
    }
    .details-description {
      color: #CCC;
      line-height: 1.8;
      font-size: 1.1rem;
      margin-bottom: 1.5rem;
    }
    .details-categorie {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #999;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }
    .details-categorie i {
      color: #FFA500;
    }
    .details-prix {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: rgba(255, 165, 0, 0.1);
      border-radius: 12px;
    }
    .prix-label {
      color: #999;
      font-size: 1rem;
    }
    .prix-value {
      color: #FFA500;
      font-size: 2rem;
      font-weight: 700;
    }
    .btn-ajouter-details {
      width: 100%;
      padding: 1.2rem;
      background: #FFA500;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }
    .btn-ajouter-details:hover {
      background: #FFB347;
      transform: translateY(-2px);
    }
    @media (max-width: 768px) {
      .details-content {
        grid-template-columns: 1fr;
      }
      .details-image {
        height: 250px;
      }
    }
    @media (max-width: 768px) {
      .menu-header h1 {
        font-size: 2.5rem;
      }
      .plats-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .menu-container {
        padding: 3rem 1rem;
      }
    }
  `]
})
export class MenuComponent implements OnInit {
  plats: Plat[] = [];
  platsFiltres: Plat[] = [];
  loading = true;
  error: string | null = null;
  filterActive = 'Tous';
  filters: string[] = ['Tous'];
  modalDetailsOpen = false;
  platSelectionne: Plat | null = null;
  categories: any[] = [];

  // Images de plats - à remplacer par vos vraies images
  platImages: { [key: string]: string } = {
    'Poulet Yassa': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop',
    'Thiébou Djeun': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    'Mafé': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
    'Couscous': 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=600&h=400&fit=crop',
    'Pastels': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop',
    'Accras de Morue': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop',
    'Soupe Kandja': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop',
    'Riz au Gras': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
    'Dibi': 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop',
    'Caldou': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop',
    'Thiéré': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    'Boulettes de Poisson': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
    'Salade César': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop',
    'Pizza Margherita': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop',
    'Burger Classique': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
    'Spaghetti Carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop',
    'Grillade Mixte': 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop',
    'Poisson Braisé': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
    'Salade de Fruits': 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop',
    'Tiramisu': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop'
  };

  constructor(
    private platService: PlatService,
    private panierService: PanierService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.chargerPlats();
    this.chargerCategories();
  }

  chargerCategories() {
    this.platService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data || [];
        // Ajouter les catégories aux filtres
        this.filters = ['Tous', ...this.categories.map(c => c.nom)];
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
      }
    });
  }

  chargerPlats() {
    this.loading = true;
    this.error = null;
    
    this.platService.getAllPlats().subscribe({
      next: (data) => {
        this.plats = data;
        this.platsFiltres = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du menu. Veuillez réessayer plus tard.';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  setFilter(filter: string) {
    this.filterActive = filter;
    if (filter === 'Tous') {
      this.platsFiltres = this.plats;
    } else {
      // Filtrer par catégorie
      this.platsFiltres = this.plats.filter(plat => 
        plat.categorie && plat.categorie.nom === filter
      );
    }
  }

  getPlatImage(plat: Plat): string {
    if (plat.imageUrl) {
      return plat.imageUrl.startsWith('http') ? plat.imageUrl : `http://localhost:8080${plat.imageUrl}`;
    }
    return this.platImages[plat.nom] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop';
  }

  onImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop';
  }

  ajouterAuPanier(plat: Plat, event?: Event) {
    try {
      this.panierService.ajouterAuPanier(plat, 1);
      // Animation de confirmation
      const button = event?.target as HTMLElement;
      if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Ajouté';
        button.style.background = '#4CAF50';
        setTimeout(() => {
          button.innerHTML = originalHTML;
          button.style.background = '';
        }, 1500);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      this.notificationService.error('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
    }
  }

  voirDetails(plat: Plat) {
    this.platSelectionne = plat;
    this.modalDetailsOpen = true;
  }

  fermerDetails() {
    this.modalDetailsOpen = false;
    this.platSelectionne = null;
  }
}
