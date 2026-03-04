import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-galerie',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="galerie-container">
      <div class="galerie-header">
        <h1><i class="fas fa-images"></i> Galerie Photos</h1>
        <p>Découvrez l'ambiance et les plats de notre restaurant</p>
      </div>

      <div class="galerie-grid">
        <div *ngFor="let photo of photos; let i = index" class="photo-card" (click)="ouvrirModal(i)">
          <div class="photo-image">
            <img [src]="photo.url" [alt]="photo.titre" (error)="onImageError($event, i)" />
            <div class="photo-overlay">
              <i class="fas fa-search-plus"></i>
            </div>
          </div>
          <div class="photo-info">
            <h3>{{ photo.titre }}</h3>
            <p>{{ photo.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour afficher les photos en grand -->
    <div class="modal" [class.open]="modalOpen" (click)="fermerModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="fermerModal()"><i class="fas fa-times"></i></button>
        <div class="modal-photo">
          <img [src]="photos[photoIndex]?.url" [alt]="photos[photoIndex]?.titre" (error)="onImageError($event, photoIndex)" />
        </div>
        <div class="modal-info">
          <h2>{{ photos[photoIndex]?.titre }}</h2>
          <p>{{ photos[photoIndex]?.description }}</p>
        </div>
        <div class="modal-nav">
          <button (click)="photoPrecedente()" [disabled]="photoIndex === 0">
            <i class="fas fa-chevron-left"></i> Précédent
          </button>
          <span>{{ photoIndex + 1 }} / {{ photos.length }}</span>
          <button (click)="photoSuivante()" [disabled]="photoIndex === photos.length - 1">
            Suivant <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .galerie-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem;
      background: #1A1A1A;
      min-height: calc(100vh - 200px);
      color: white;
    }
    .galerie-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    .galerie-header h1 {
      font-size: 3.5rem;
      color: #FFA500;
      margin-bottom: 1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .galerie-header h1 i {
      font-size: 3rem;
    }
    .galerie-header p {
      font-size: 1.3rem;
      color: #999;
    }
    .galerie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2.5rem;
    }
    .photo-card {
      background: #2A2A2A;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: all 0.4s;
      border: 2px solid rgba(255, 107, 53, 0.1);
    }
    .photo-card:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 15px 40px rgba(255, 107, 53, 0.3);
      border-color: #FF6B35;
    }
    .photo-placeholder {
      width: 100%;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .photo-placeholder::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="1.5" fill="rgba(255,255,255,0.2)"/></svg>');
    }
    .photo-emoji {
      font-size: 6rem;
      position: relative;
      z-index: 1;
      filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
    }
    .photo-info {
      padding: 2rem;
      background: #2A2A2A;
    }
    .photo-info h3 {
      margin: 0 0 0.8rem;
      color: white;
      font-size: 1.4rem;
      font-weight: 700;
    }
    .photo-info p {
      color: #999;
      margin: 0;
      line-height: 1.6;
    }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;
      backdrop-filter: blur(10px);
    }
    .modal.open {
      opacity: 1;
      visibility: visible;
    }
    .modal-content {
      max-width: 900px;
      max-height: 90vh;
      background: #2A2A2A;
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    .modal-close {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(255, 165, 0, 0.9);
      color: white;
      border: none;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      font-size: 1.2rem;
      cursor: pointer;
      z-index: 1;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-close:hover {
      background: #FFA500;
      transform: rotate(90deg) scale(1.1);
    }
    .modal-photo {
      width: 100%;
      height: 450px;
      overflow: hidden;
    }
    .modal-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .modal-info {
      padding: 2.5rem;
      text-align: center;
      background: #2A2A2A;
    }
    .modal-info h2 {
      margin: 0 0 1rem;
      color: white;
      font-size: 2rem;
      font-weight: 700;
    }
    .modal-info p {
      color: #999;
      font-size: 1.1rem;
      line-height: 1.8;
    }
    .modal-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(255, 165, 0, 0.2);
      background: #2A2A2A;
    }
    .modal-nav button {
      padding: 0.8rem 1.5rem;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.25);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .modal-nav button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 165, 0, 0.35);
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
    }
    .modal-nav button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }
    .modal-nav span {
      font-weight: 700;
      color: #FFA500;
      font-size: 1.1rem;
    }
    @media (max-width: 768px) {
      .galerie-grid {
        grid-template-columns: 1fr;
      }
      .galerie-header h1 {
        font-size: 2.5rem;
      }
    }
  `]
})
export class GalerieComponent {
  modalOpen = false;
  photoIndex = 0;

  photos = [
    { 
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop', 
      titre: 'Notre Salle', 
      description: 'Ambiance chaleureuse et moderne' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 
      titre: 'Poulet Yassa', 
      description: 'Notre spécialité maison' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop', 
      titre: 'Thiébou Djeun', 
      description: 'Plat traditionnel préparé avec amour' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop', 
      titre: 'Mafé', 
      description: 'Sauce à l\'arachide délicieuse' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop', 
      titre: 'Pizza Maison', 
      description: 'Pizzas préparées au feu de bois' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop', 
      titre: 'Desserts', 
      description: 'Sélection de desserts faits maison' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop', 
      titre: 'Cave à Vin', 
      description: 'Sélection de vins soigneusement choisie' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop', 
      titre: 'Notre Cuisine', 
      description: 'Cuisine ouverte, chefs expérimentés' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=80', 
      titre: 'Soirée', 
      description: 'Ambiance détendue pour vos soirées' 
    }
  ];

  onImageError(event: any, index: number) {
    event.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop';
  }

  ouvrirModal(index: number) {
    this.photoIndex = index;
    this.modalOpen = true;
  }

  fermerModal() {
    this.modalOpen = false;
  }

  photoPrecedente() {
    if (this.photoIndex > 0) {
      this.photoIndex--;
    }
  }

  photoSuivante() {
    if (this.photoIndex < this.photos.length - 1) {
      this.photoIndex++;
    }
  }
}

