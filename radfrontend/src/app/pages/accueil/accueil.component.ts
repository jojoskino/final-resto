import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section avec image de fond -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-title-wrapper">
          <div class="decoration-point point-1"></div>
          <h1>
            <span class="hero-line1">Une <strong>Expérience</strong></span>
            <span class="hero-line2"><strong>Culinaire Unique</strong></span>
          </h1>
          <div class="decoration-point point-2"></div>
        </div>
        <p class="hero-description">
          Découvrez notre sélection de plats raffinés, préparés avec passion et des ingrédients d'exception. 
          Une cuisine moderne qui célèbre les saveurs.
        </p>
        <div class="hero-buttons">
          <a routerLink="/menu" class="btn btn-primary">Découvrir le Menu</a>
          <a routerLink="/reservation" class="btn btn-secondary">Réserver une Table</a>
        </div>
      </div>
    </section>

    <!-- Notre Cadre Section -->
    <section class="cadre">
      <div class="container">
        <h2>
          <span class="title-white">Notre</span>
          <span class="title-orange">Cadre</span>
        </h2>
        <p class="section-description">
          Découvrez l'ambiance unique de notre restaurant, où élégance et modernité se rencontrent 
          pour créer une expérience inoubliable.
        </p>
        <div class="galerie-grid">
          <div class="galerie-item" *ngFor="let img of cadreImages; let i = index">
            <div class="image-wrapper">
              <img [src]="img.url" [alt]="img.alt" (error)="onImageError($event)" />
              <div class="image-overlay-hover">
                <h3>{{ img.title }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- À Propos Section -->
    <section class="about">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <p>
              Nous sélectionnons rigoureusement nos fournisseurs locaux pour garantir des ingrédients 
              frais et de qualité. Nos chefs talentueux créent des associations de saveurs surprenantes 
              et délicates, pour une expérience culinaire unique.
            </p>
            <div class="team-section">
              <h3>Notre Équipe</h3>
              <div class="avatars">
                <div class="avatar avatar-1" *ngFor="let chef of chefs">
                  <img [src]="chef.avatar" [alt]="chef.nom" (error)="onImageError($event)" />
                  <span class="avatar-initials">{{ chef.initials }}</span>
                </div>
              </div>
              <p class="team-text">3 chefs passionnés</p>
            </div>
          </div>
          <div class="about-image">
            <div class="image-wrapper-large">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop" 
                   alt="Chef en cuisine" (error)="onImageError($event)" />
              <div class="image-overlay">
                <h4>Chef Jean-Claude</h4>
                <p>15 ans d'expérience gastronomique</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Cards -->
    <section class="features">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card" *ngFor="let feature of features">
            <div class="feature-icon-wrapper">
              <div class="feature-icon" [innerHTML]="feature.icon"></div>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section avec image de fond */
    .hero {
      position: relative;
      background: linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(26, 26, 26, 0.85) 100%),
                  url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop') center/cover;
      color: white;
      padding: 4rem 2rem 6rem;
      text-align: center;
      min-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%);
    }
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 900px;
      margin: 0 auto;
    }
    .hero-title-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4rem;
      margin-bottom: 2rem;
    }
    .hero-content h1 {
      margin: 0;
      font-family: 'Playfair Display', serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .hero-line1 {
      display: block;
      font-size: 5rem;
      color: white;
      font-weight: 300;
      margin-bottom: 0.1rem;
      letter-spacing: 2px;
      line-height: 1;
    }
    .hero-line2 {
      display: block;
      font-size: 5rem;
      color: #FFA500;
      font-weight: 400;
      letter-spacing: 2px;
      line-height: 1;
    }
    .hero-line1 strong,
    .hero-line2 strong {
      font-weight: 700;
    }
    .decoration-point {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #FFA500;
      animation: pulse 2s ease-in-out infinite;
      box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
      flex-shrink: 0;
      pointer-events: none;
    }
    .point-1 {
      animation-delay: 0s;
    }
    .point-2 {
      animation-delay: 1s;
    }
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.3);
        opacity: 1;
      }
    }
    .hero-description {
      font-size: 1.3rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 2;
      margin-bottom: 3rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      font-weight: 300;
    }
    .hero-buttons {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
      z-index: 10;
      position: relative;
    }
    .btn {
      padding: 1.2rem 3rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.2s ease;
      display: inline-block;
      position: relative;
      z-index: 10;
    }
    .btn-primary {
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 165, 0, 0.3);
    }
    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid #FFA500;
    }
    .btn-secondary:hover {
      background: rgba(255, 165, 0, 0.1);
      border-color: #FFB347;
    }

    /* Notre Cadre Section */
    .cadre {
      background: #1A1A1A;
      padding: 8rem 2rem;
      color: white;
      position: relative;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
    }
    h2 {
      text-align: center;
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
    .section-description {
      text-align: center;
      color: #999;
      font-size: 1.2rem;
      line-height: 2;
      max-width: 800px;
      margin: 0 auto 4rem;
      font-weight: 300;
    }
    .galerie-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
    .galerie-item {
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      aspect-ratio: 4/3;
      cursor: pointer;
    }
    .image-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    .image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }
    .galerie-item:hover .image-wrapper img {
      opacity: 0.9;
    }
    .image-overlay-hover {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
      display: flex;
      align-items: flex-end;
      padding: 2rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .galerie-item:hover .image-overlay-hover {
      opacity: 1;
    }
    .image-overlay-hover h3 {
      color: white;
      font-size: 1.5rem;
      margin: 0;
    }

    /* À Propos Section */
    .about {
      background: #1A1A1A;
      padding: 8rem 2rem;
      color: white;
    }
    .about-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
      align-items: center;
    }
    .about-text p {
      color: #CCC;
      font-size: 1.2rem;
      line-height: 2.2;
      margin-bottom: 3rem;
      font-weight: 300;
    }
    .team-section h3 {
      color: white;
      font-size: 1.8rem;
      margin-bottom: 2rem;
      font-weight: 400;
    }
    .avatars {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      border: 3px solid #FFA500;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-initials {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FFA500;
      color: white;
      font-weight: 700;
      font-size: 1.2rem;
    }
    .avatar img + .avatar-initials {
      display: none;
    }
    .team-text {
      color: #999;
      font-size: 1rem;
      margin: 0;
    }
    .about-image {
      position: relative;
    }
    .image-wrapper-large {
      width: 100%;
      height: 600px;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    .image-wrapper-large img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
      padding: 3rem 2rem 2rem;
      color: white;
    }
    .image-overlay h4 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .image-overlay p {
      margin: 0;
      color: #999;
      font-size: 1rem;
    }

    /* Features Section */
    .features {
      background: #1A1A1A;
      padding: 8rem 2rem;
      color: white;
      position: relative;
    }
    .features::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, rgba(255, 165, 0, 0.5) 50%, transparent 100%);
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
    }
    .feature-card {
      background: #2A2A2A;
      padding: 4rem 3rem;
      border-radius: 24px;
      text-align: center;
      border: 1px solid rgba(255, 165, 0, 0.1);
      transition: border-color 0.2s ease;
    }
    .feature-card:hover {
      border-color: rgba(255, 165, 0, 0.4);
    }
    .feature-icon-wrapper {
      margin-bottom: 2rem;
    }
    .feature-icon {
      font-size: 4rem;
      color: #FFA500;
      display: inline-block;
    }
    .feature-card h3 {
      color: white;
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }
    .feature-card p {
      color: #999;
      line-height: 2;
      margin: 0;
      font-size: 1.1rem;
    }

    @media (max-width: 1024px) {
      .hero-line1,
      .hero-line2 {
        font-size: 3.5rem;
      }
      .galerie-grid,
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .about-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .hero {
        padding: 6rem 1rem 4rem;
        min-height: 80vh;
      }
      .hero-line1,
      .hero-line2 {
        font-size: 2.5rem;
      }
      .hero-description {
        font-size: 1rem;
      }
      .galerie-grid,
      .features-grid {
        grid-template-columns: 1fr;
      }
      h2 {
        font-size: 2.5rem;
      }
      .cadre,
      .about,
      .features {
        padding: 4rem 1rem;
      }
      .btn {
        padding: 1rem 2rem;
        font-size: 1rem;
      }
    }
  `]
})
export class AccueilComponent {
  cadreImages = [
    {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      alt: 'Salle du restaurant',
      title: 'Notre Salle'
    },
    {
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
      alt: 'Ambiance moderne',
      title: 'Ambiance Moderne'
    },
    {
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      alt: 'Service raffiné',
      title: 'Service Raffiné'
    }
  ];

  chefs = [
    { nom: 'Jean-Claude', initials: 'JC', avatar: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=200&h=200&fit=crop&crop=face' },
    { nom: 'Sophie Martin', initials: 'SM', avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop&crop=face' },
    { nom: 'Alexandre Leclerc', initials: 'AL', avatar: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=200&h=200&fit=crop&crop=face' }
  ];

  features = [
    {
      icon: '<i class="fas fa-book-open"></i>',
      title: 'Cuisine Authentique',
      description: 'Des recettes traditionnelles revisitées avec créativité et passion.'
    },
    {
      icon: '<i class="fas fa-check-circle"></i>',
      title: 'Produits Frais',
      description: 'Sélection rigoureuse d\'ingrédients locaux et de saison.'
    },
    {
      icon: '<i class="fas fa-heart"></i>',
      title: 'Passion & Excellence',
      description: 'Un service attentionné dans une ambiance chaleureuse et raffinée.'
    }
  ];

  onImageError(event: any) {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;
    if (parent && parent.querySelector('.avatar-initials')) {
      parent.querySelector('.avatar-initials').style.display = 'flex';
    }
  }
}
