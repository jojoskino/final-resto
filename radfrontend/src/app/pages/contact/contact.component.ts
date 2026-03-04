import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="contact-container">
      <div class="contact-header">
        <h1><i class="fas fa-envelope"></i> Contactez-nous</h1>
        <p>Nous sommes là pour répondre à toutes vos questions</p>
      </div>

      <div class="contact-content">
        <div class="contact-info">
          <div class="info-card">
            <h3><i class="fas fa-map-marker-alt"></i> Adresse</h3>
            <p>123 Avenue de la Gastronomie</p>
            <p>Dakar, Sénégal</p>
          </div>
          <div class="info-card">
            <h3><i class="fas fa-phone"></i> Téléphone</h3>
            <p>+221 77 123 45 67</p>
            <p>+221 33 123 45 67</p>
          </div>
          <div class="info-card">
            <h3><i class="fas fa-envelope"></i> Email</h3>
            <p>contact@radresto.sn</p>
            <p>reservation@radresto.sn</p>
          </div>
          <div class="info-card">
            <h3><i class="fas fa-clock"></i> Horaires</h3>
            <p>Lundi - Vendredi: 11h - 22h</p>
            <p>Samedi - Dimanche: 12h - 23h</p>
          </div>
        </div>

        <form class="contact-form" (ngSubmit)="envoyerMessage()" #contactForm="ngForm">
          <div class="form-group">
            <label for="nom">Nom complet *</label>
            <input 
              type="text" 
              id="nom" 
              name="nom" 
              [(ngModel)]="formData.nom" 
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="formData.email" 
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="telephone">Téléphone</label>
            <input 
              type="tel" 
              id="telephone" 
              name="telephone" 
              [(ngModel)]="formData.telephone" 
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="sujet">Sujet *</label>
            <select 
              id="sujet" 
              name="sujet" 
              [(ngModel)]="formData.sujet" 
              required
              class="form-control"
            >
              <option value="">Sélectionnez un sujet</option>
              <option value="reservation">Réservation</option>
              <option value="question">Question générale</option>
              <option value="reclamation">Réclamation</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label for="message">Message *</label>
            <textarea 
              id="message" 
              name="message" 
              [(ngModel)]="formData.message" 
              required
              rows="5"
              class="form-control"
            ></textarea>
          </div>

          <button 
            type="submit" 
            class="btn-submit"
            [disabled]="!contactForm.valid || envoiEnCours"
          >
            {{ envoiEnCours ? 'Envoi en cours...' : 'Envoyer le message' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem;
      background: #1A1A1A;
      min-height: calc(100vh - 200px);
      color: white;
    }
    .contact-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    .contact-header h1 {
      font-size: 3.5rem;
      color: #FFA500;
      margin-bottom: 1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .contact-header h1 i {
      font-size: 3rem;
    }
    .contact-header p {
      font-size: 1.3rem;
      color: #999;
    }
    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 3rem;
    }
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .info-card {
      background: #2A2A2A;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      border-left: 4px solid #FFA500;
      transition: all 0.3s;
    }
    .info-card:hover {
      transform: translateX(5px);
      box-shadow: 0 12px 30px rgba(255, 165, 0, 0.25);
    }
    .info-card h3 {
      margin: 0 0 1rem;
      color: #FFA500;
      font-size: 1.3rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .info-card h3 i {
      font-size: 1.2rem;
    }
    .info-card p {
      margin: 0.7rem 0;
      color: #999;
      line-height: 1.8;
    }
    .contact-form {
      background: #2A2A2A;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .form-group {
      margin-bottom: 1.8rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.7rem;
      color: white;
      font-weight: 600;
      font-size: 1rem;
    }
    .form-control {
      width: 100%;
      padding: 1rem;
      border: 2px solid rgba(255, 165, 0, 0.3);
      border-radius: 12px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: all 0.3s;
      background: #1A1A1A;
      color: white;
    }
    .form-control:focus {
      outline: none;
      border-color: #FFA500;
      background: #2A2A2A;
      box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.2);
    }
    .btn-submit {
      width: 100%;
      padding: 1.2rem;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.25);
    }
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 165, 0, 0.35);
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    @media (max-width: 768px) {
      .contact-content {
        grid-template-columns: 1fr;
      }
      .contact-header h1 {
        font-size: 2.5rem;
      }
    }
  `]
})
export class ContactComponent {
  formData = {
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  };
  envoiEnCours = false;

  constructor(private notificationService: NotificationService) {}

  envoyerMessage() {
    this.envoiEnCours = true;
    
    // Simulation d'envoi (à remplacer par un appel API réel)
    setTimeout(() => {
      console.log('Message envoyé:', this.formData);
      this.notificationService.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      this.formData = {
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      };
      this.envoiEnCours = false;
    }, 1000);
  }
}

