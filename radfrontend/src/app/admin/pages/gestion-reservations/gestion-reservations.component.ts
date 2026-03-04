import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-gestion-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gestion-reservations">
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fas fa-calendar-alt"></i> Gestion des Réservations</h1>
          <p class="subtitle">Gérez les réservations de votre restaurant</p>
        </div>
        <button class="btn-primary" (click)="ouvrirModal()">
          <i class="fas fa-plus"></i> Ajouter une réservation
        </button>
      </div>
      
      <div class="filters">
        <button 
          *ngFor="let filter of filters" 
          [class.active]="filterActive === filter"
          (click)="setFilter(filter)"
          class="filter-btn">
          {{ filter }}
        </button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Personnes</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let reservation of getReservationsPaginees()">
              <td><span class="id-badge">#{{ reservation.id }}</span></td>
              <td><strong>{{ reservation.nom }}</strong></td>
              <td>{{ reservation.date | date:'shortDate' }}</td>
              <td>{{ reservation.heure }}</td>
              <td>{{ reservation.nbPersonnes }}</td>
              <td>
                <span class="badge" [class.badge-success]="reservation.statut === 'Confirmée'" 
                      [class.badge-warning]="reservation.statut === 'En attente'"
                      [class.badge-danger]="reservation.statut === 'Annulée'">
                  {{ reservation.statut || 'En attente' }}
                </span>
              </td>
              <td>
                <button class="btn-icon btn-edit" (click)="editerReservation(reservation)" title="Modifier">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="reservationsFiltrees.length === 0">
              <td colspan="7" class="empty-state">
                <div class="empty-icon"><i class="fas fa-calendar-alt"></i></div>
                <p>Aucune réservation</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="reservationsFiltrees.length > pageSize">
        <button [disabled]="currentPage === 1" (click)="previousPage()" class="pagination-btn">
          <i class="fas fa-chevron-left"></i> Précédent
        </button>
        <div class="pagination-info">
          Page {{ currentPage }} sur {{ getTotalPages() }}
        </div>
        <button [disabled]="currentPage === getTotalPages()" (click)="nextPage()" class="pagination-btn">
          Suivant <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- Modal pour créer/modifier une réservation -->
      <div class="modal" [class.open]="modalOpen" (click)="fermerModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <i class="fas" [class.fa-edit]="reservationEdit" [class.fa-plus]="!reservationEdit"></i> 
              {{ reservationEdit ? 'Modifier' : 'Ajouter' }} une réservation
            </h2>
            <button class="close-btn" (click)="fermerModal()"><i class="fas fa-times"></i></button>
          </div>
          <form (ngSubmit)="sauvegarderReservation()" class="modal-form">
            <div class="form-group">
              <label>Nom du client *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.nom" 
                name="nom" 
                required
                placeholder="Ex: Diallo"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Date *</label>
              <input 
                type="date" 
                [(ngModel)]="formData.date" 
                name="date" 
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Heure *</label>
              <input 
                type="time" 
                [(ngModel)]="formData.heure" 
                name="heure" 
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Nombre de personnes *</label>
              <input 
                type="number" 
                [(ngModel)]="formData.nbPersonnes" 
                name="nbPersonnes" 
                required
                min="1"
                placeholder="2"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Statut</label>
              <select 
                [(ngModel)]="formData.statut" 
                name="statut" 
                class="form-input"
              >
                <option value="En attente">En attente</option>
                <option value="Confirmée">Confirmée</option>
                <option value="Annulée">Annulée</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="fermerModal()">Annuler</button>
              <button type="submit" class="btn-primary" [disabled]="loading">
                {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gestion-reservations {
      color: white;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 2rem;
    }
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.9rem 1.8rem;
      background: #FF6B35;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-primary:hover:not(:disabled) {
      background: #FF8C42;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .header-content h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      color: white;
      font-weight: 700;
    }
    .subtitle {
      margin: 0;
      color: #999;
      font-size: 0.95rem;
    }
    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .filter-btn {
      padding: 0.8rem 1.5rem;
      background: #1A1A1A;
      color: white;
      border: 1px solid rgba(255, 107, 53, 0.3);
      border-radius: 10px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }
    .filter-btn:hover {
      border-color: #FF6B35;
      background: rgba(255, 107, 53, 0.1);
    }
    .filter-btn.active {
      background: #FF6B35;
      border-color: #FF6B35;
      color: white;
    }
    .table-wrapper {
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      border-radius: 16px;
      border: 1px solid rgba(255, 107, 53, 0.15);
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead {
      background: rgba(255, 107, 53, 0.08);
    }
    th {
      padding: 1.25rem 1.5rem;
      text-align: left;
      color: #FF6B35;
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td {
      padding: 1.25rem 1.5rem;
      border-top: 1px solid rgba(255, 107, 53, 0.1);
      color: #CCC;
    }
    .id-badge {
      background: rgba(255, 107, 53, 0.2);
      color: #FF6B35;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    strong {
      color: white;
      font-weight: 600;
    }
    .badge {
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .badge-success {
      background: rgba(76, 175, 80, 0.2);
      color: #4CAF50;
    }
    .badge-warning {
      background: rgba(255, 152, 0, 0.2);
      color: #FF9800;
    }
    .badge-danger {
      background: rgba(255, 68, 68, 0.2);
      color: #ff4444;
    }
    .btn-icon {
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.6rem;
      border-radius: 8px;
      transition: all 0.2s ease;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid;
    }
    .btn-view {
      background: rgba(33, 150, 243, 0.15);
      border-color: rgba(33, 150, 243, 0.3);
      color: #2196F3;
    }
    .btn-view:hover {
      background: rgba(33, 150, 243, 0.3);
      border-color: rgba(33, 150, 243, 0.5);
      transform: scale(1.1);
      color: #42A5F5;
    }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      z-index: 2000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      backdrop-filter: blur(5px);
      overflow-y: auto;
      padding: 2rem 0;
    }
    .modal.open {
      opacity: 1;
      visibility: visible;
    }
    .modal-content {
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      border-radius: 20px;
      width: 90%;
      max-width: 600px;
      color: white;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 107, 53, 0.2);
      max-height: 90vh;
      overflow-y: auto;
      margin: 2rem auto;
    }
    .modal-content::-webkit-scrollbar {
      width: 8px;
    }
    .modal-content::-webkit-scrollbar-track {
      background: #1A1A1A;
      border-radius: 10px;
    }
    .modal-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      border-radius: 10px;
    }
    .modal-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #FF8C42 0%, #FFA500 100%);
    }
    .table-wrapper::-webkit-scrollbar {
      height: 8px;
    }
    .table-wrapper::-webkit-scrollbar-track {
      background: #1A1A1A;
      border-radius: 10px;
    }
    .table-wrapper::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      border-radius: 10px;
    }
    .table-wrapper::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #FF8C42 0%, #FFA500 100%);
    }
    .modal-header {
      padding: 2rem 2rem 1.5rem;
      border-bottom: 1px solid rgba(255, 107, 53, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h2 {
      margin: 0;
      color: #FF6B35;
      font-size: 1.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #999;
      font-size: 1.2rem;
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }
    .close-btn:hover {
      background: rgba(255, 107, 53, 0.1);
      color: #FF6B35;
    }
    .modal-form {
      padding: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.7rem;
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .form-input {
      width: 100%;
      padding: 1rem;
      background: #0F0F0F;
      border: 1px solid rgba(255, 107, 53, 0.3);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
      font-family: inherit;
    }
    .form-input:focus {
      outline: none;
      border-color: #FF6B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 107, 53, 0.15);
    }
    .btn-secondary {
      padding: 0.9rem 1.8rem;
      background: transparent;
      color: #999;
      border: 1px solid #444;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      border-color: #666;
      color: white;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }
    .empty-state p {
      color: #999;
      margin: 0;
      font-size: 1rem;
    }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
      padding: 1.5rem;
      background: rgba(26, 26, 26, 0.5);
      border-radius: 12px;
      border: 1px solid rgba(255, 107, 53, 0.1);
    }
    .pagination-btn {
      padding: 0.8rem 1.5rem;
      background: rgba(255, 107, 53, 0.1);
      color: #FF6B35;
      border: 1px solid #FF6B35;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .pagination-btn:hover:not(:disabled) {
      background: #FF6B35;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pagination-info {
      color: #999;
      font-size: 0.95rem;
      font-weight: 600;
      min-width: 150px;
      text-align: center;
    }
  `]
})
export class GestionReservationsComponent implements OnInit {
  reservations: any[] = [];
  reservationsFiltrees: any[] = [];
  filterActive = 'Toutes';
  filters = ['Toutes', 'En attente', 'Confirmée', 'Annulée'];
  modalOpen = false;
  loading = false;
  reservationEdit: any = null;
  currentPage = 1;
  pageSize = 10;
  formData = {
    nom: '',
    date: '',
    heure: '',
    nbPersonnes: 1,
    statut: 'En attente'
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Pour l'instant, on simule des réservations
    // À remplacer par un vrai endpoint API
    this.reservations = [];
    this.reservationsFiltrees = [];
  }

  setFilter(filter: string) {
    this.filterActive = filter;
    if (filter === 'Toutes') {
      this.reservationsFiltrees = this.reservations;
    } else {
      this.reservationsFiltrees = this.reservations.filter(r => r.statut === filter);
    }
    this.currentPage = 1;
  }

  ouvrirModal() {
    this.reservationEdit = null;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.formData = { 
      nom: '', 
      date: tomorrow.toISOString().split('T')[0], 
      heure: '19:00', 
      nbPersonnes: 2, 
      statut: 'En attente' 
    };
    this.modalOpen = true;
  }

  fermerModal() {
    this.modalOpen = false;
    this.reservationEdit = null;
    this.loading = false;
  }

  editerReservation(reservation: any) {
    this.reservationEdit = reservation;
    this.formData = {
      nom: reservation.nom || '',
      date: reservation.date ? new Date(reservation.date).toISOString().split('T')[0] : '',
      heure: reservation.heure || '19:00',
      nbPersonnes: reservation.nbPersonnes || 2,
      statut: reservation.statut || 'En attente'
    };
    this.modalOpen = true;
  }

  sauvegarderReservation() {
    if (!this.formData.nom || this.formData.nom.trim() === '') {
      this.notificationService.warning('Le nom est requis.');
      return;
    }
    if (!this.formData.date) {
      this.notificationService.warning('La date est requise.');
      return;
    }
    if (!this.formData.heure) {
      this.notificationService.warning('L\'heure est requise.');
      return;
    }

    this.loading = true;
    // Pour l'instant, on simule l'enregistrement
    // À remplacer par un vrai endpoint API
    setTimeout(() => {
      this.notificationService.success(this.reservationEdit ? 'Réservation modifiée avec succès !' : 'Réservation ajoutée avec succès !');
      this.fermerModal();
      // Recharger les réservations
      this.ngOnInit();
    }, 500);
  }

  voirDetails(reservation: any) {
    this.editerReservation(reservation);
  }

  getReservationsPaginees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.reservationsFiltrees.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.reservationsFiltrees.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
