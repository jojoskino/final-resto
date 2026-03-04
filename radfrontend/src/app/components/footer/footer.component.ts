import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Le RadResto</h3>
            <p>Une expérience culinaire raffinée au cœur de la ville. Cuisine moderne et créative avec des produits frais et de qualité.</p>
          </div>
          <div class="footer-section">
            <h4>Horaires</h4>
            <p>Lun - Jeu : 12h - 14h30 / 19h - 22h30</p>
            <p>Ven - Sam : 12h - 14h30 / 19h - 23h</p>
            <p>Dimanche : 19h - 22h</p>
          </div>
          <div class="footer-section">
            <h4>Contact</h4>
            <p>123 Rue de la Gastronomie</p>
            <p>75001 Paris, France</p>
            <p>+33 1 23 45 67 89</p>
            <p>contact@radresto.fr</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 Le RadResto. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1A1A1A;
      color: white;
      padding: 4rem 0 2rem;
      margin-top: 0;
      border-top: 1px solid rgba(255, 107, 53, 0.1);
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 3rem;
    }
    .footer-content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4rem;
      margin-bottom: 3rem;
    }
    .footer-section h3 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: #FF6B35;
      font-weight: 600;
    }
    .footer-section h4 {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: white;
      font-weight: 600;
    }
    .footer-section p {
      margin: 0.8rem 0;
      color: #999;
      line-height: 1.8;
      font-size: 0.95rem;
    }
    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: #666;
      font-size: 0.9rem;
    }
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .container {
        padding: 0 1.5rem;
      }
    }
  `]
})
export class FooterComponent {}

