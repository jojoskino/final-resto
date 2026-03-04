import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reservation-container">
      <div class="reservation-header">
        <h1><i class="fas fa-calendar-check"></i> Réserver une table</h1>
        <p>Réservez votre table en ligne, c'est simple et rapide !</p>
      </div>

      <form class="reservation-form" (ngSubmit)="soumettreReservation()" #reservationForm="ngForm">
        <div class="form-row">
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
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="telephone">Téléphone *</label>
            <input 
              type="tel" 
              id="telephone" 
              name="telephone" 
              [(ngModel)]="formData.telephone" 
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="nbPersonnes">Nombre de personnes *</label>
            <select 
              id="nbPersonnes" 
              name="nbPersonnes" 
              [(ngModel)]="formData.nbPersonnes" 
              required
              class="form-control"
            >
              <option value="">Sélectionnez</option>
              <option value="1">1 personne</option>
              <option value="2">2 personnes</option>
              <option value="3">3 personnes</option>
              <option value="4">4 personnes</option>
              <option value="5">5 personnes</option>
              <option value="6">6 personnes</option>
              <option value="7">7+ personnes</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">Date *</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              [(ngModel)]="formData.date" 
              required
              [min]="minDate"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="heure">Heure *</label>
            <select 
              id="heure" 
              name="heure" 
              [(ngModel)]="formData.heure" 
              required
              class="form-control"
            >
              <option value="">Sélectionnez</option>
              <option *ngFor="let h of heures" [value]="h">{{ h }}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="commentaires">Commentaires ou demandes spéciales</label>
          <textarea 
            id="commentaires" 
            name="commentaires" 
            [(ngModel)]="formData.commentaires" 
            rows="4"
            class="form-control"
            placeholder="Allergies, préférences, occasion spéciale..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          class="btn-submit"
          [disabled]="!reservationForm.valid || envoiEnCours"
        >
          {{ envoiEnCours ? 'Traitement en cours...' : 'Confirmer la réservation' }}
        </button>
      </form>

      <div class="reservation-info">
        <h3><i class="fas fa-info-circle"></i> Informations importantes</h3>
        <ul>
          <li><i class="fas fa-check"></i> Les réservations sont confirmées par email</li>
          <li><i class="fas fa-check"></i> Merci d'arriver à l'heure prévue</li>
          <li><i class="fas fa-check"></i> Pour annuler, contactez-nous au moins 2h à l'avance</li>
          <li><i class="fas fa-check"></i> Les grandes tables (7+ personnes) nécessitent un appel téléphonique</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .reservation-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 3rem 2rem;
      background: #1A1A1A;
      min-height: calc(100vh - 200px);
      color: white;
    }
    .reservation-header {
      text-align: center;
      margin-bottom: 4rem;
    }
    .reservation-header h1 {
      font-size: 3.5rem;
      color: #FFA500;
      margin-bottom: 1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .reservation-header h1 i {
      font-size: 3rem;
    }
    .reservation-header p {
      font-size: 1.3rem;
      color: #999;
    }
    .reservation-form {
      background: #2A2A2A;
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      margin-bottom: 2rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
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
    .reservation-info {
      background: #2A2A2A;
      padding: 2.5rem;
      border-radius: 20px;
      border-left: 4px solid #FFA500;
    }
    .reservation-info h3 {
      margin-bottom: 1.5rem;
      color: #FFA500;
      font-size: 1.5rem;
      font-weight: 700;
    }
    .reservation-info ul {
      list-style: none;
      padding: 0;
    }
    .reservation-info li {
      padding: 0.8rem 0;
      color: #999;
      line-height: 1.8;
      position: relative;
      padding-left: 1.5rem;
    }
    .reservation-info li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #FFA500;
    }
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      .reservation-header h1 {
        font-size: 2.5rem;
      }
    }
  `]
})
export class ReservationComponent {
  formData = {
    nom: '',
    email: '',
    telephone: '',
    nbPersonnes: '',
    date: '',
    heure: '',
    commentaires: ''
  };
  envoiEnCours = false;
  heures: string[] = [];
  minDate = '';

  constructor(private notificationService: NotificationService) {
    // Générer les heures disponibles
    for (let h = 11; h <= 22; h++) {
      this.heures.push(`${h}:00`);
      if (h < 22) {
        this.heures.push(`${h}:30`);
      }
    }

    // Définir la date minimale (aujourd'hui)
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  soumettreReservation() {
    this.envoiEnCours = true;
    
    // Simulation d'envoi (à remplacer par un appel API réel)
    setTimeout(() => {
      console.log('Réservation:', this.formData);
      this.notificationService.success(`Réservation confirmée pour ${this.formData.nbPersonnes} personne(s) le ${this.formData.date} à ${this.formData.heure} ! Un email de confirmation vous a été envoyé.`);
      this.formData = {
        nom: '',
        email: '',
        telephone: '',
        nbPersonnes: '',
        date: '',
        heure: '',
        commentaires: ''
      };
      this.envoiEnCours = false;
    }, 1000);
  }
}

