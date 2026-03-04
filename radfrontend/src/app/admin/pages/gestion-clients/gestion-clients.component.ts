import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-gestion-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="gestion-clients">
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fas fa-users"></i> Gestion des Clients</h1>
          <p class="subtitle">Liste de tous vos clients</p>
        </div>
        <button class="btn-primary" (click)="ouvrirModal()">
          <i class="fas fa-plus"></i> Ajouter un client
        </button>
      </div>
      
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="🔍 Rechercher un client..." 
          [(ngModel)]="searchTerm"
          (input)="filtrerClients()"
          class="search-input"
        />
        <div class="stats-info">
          <span class="stat-badge">{{ clientsFiltres.length }} client{{ clientsFiltres.length > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of getClientsPagines()">
              <td><span class="id-badge">#{{ client.idClient }}</span></td>
              <td><strong>{{ client.nom }}</strong></td>
              <td>{{ client.prenom || '-' }}</td>
              <td>{{ client.telephone || '-' }}</td>
              <td>{{ client.adresse || '-' }}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon btn-edit" (click)="editerClient(client)" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon btn-delete" (click)="supprimerClient(client.idClient!)" title="Supprimer">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="clientsFiltres.length === 0">
              <td colspan="6" class="empty-state">
                <div class="empty-icon"><i class="fas fa-users"></i></div>
                <p>{{ searchTerm ? 'Aucun client trouvé' : 'Aucun client enregistré' }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="clientsFiltres.length > pageSize">
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

      <!-- Modal pour créer/modifier un client -->
      <div class="modal" [class.open]="modalOpen" (click)="fermerModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <i class="fas" [class.fa-edit]="clientEdit" [class.fa-plus]="!clientEdit"></i> 
              {{ clientEdit ? 'Modifier' : 'Ajouter' }} un client
            </h2>
            <button class="close-btn" (click)="fermerModal()"><i class="fas fa-times"></i></button>
          </div>
          <form (ngSubmit)="sauvegarderClient()" class="modal-form">
            <div class="form-group">
              <label>Nom *</label>
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
              <label>Prénom</label>
              <input 
                type="text" 
                [(ngModel)]="formData.prenom" 
                name="prenom" 
                placeholder="Ex: Amadou"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Téléphone *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.telephone" 
                name="telephone" 
                required
                placeholder="Ex: +221 77 123 45 67"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Adresse</label>
              <textarea 
                [(ngModel)]="formData.adresse" 
                name="adresse" 
                rows="3"
                placeholder="Adresse du client..."
                class="form-textarea"
              ></textarea>
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

    <!-- Dialog de confirmation -->
    <app-confirm-dialog
      [isOpen]="confirmSupprimerOpen"
      title="Supprimer le client"
      message="Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible."
      confirmText="Oui, supprimer"
      cancelText="Annuler"
      type="warning"
      (confirmed)="confirmerSuppression()"
      (cancelled)="confirmSupprimerOpen = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .gestion-clients {
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
      background: #FFA500;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    .btn-primary:hover:not(:disabled) {
      background: #FFB347;
      transform: translateY(-2px);
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
    .search-bar {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      align-items: center;
    }
    .search-input {
      flex: 1;
      padding: 1rem 1.5rem;
      background: #1A1A1A;
      border: 1px solid rgba(255, 107, 53, 0.2);
      border-radius: 12px;
      color: white;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    .search-input:focus {
      outline: none;
      border-color: #FF6B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    .search-input::placeholder {
      color: #666;
    }
    .stats-info {
      display: flex;
      align-items: center;
    }
    .stat-badge {
      background: rgba(255, 107, 53, 0.2);
      color: #FF6B35;
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
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
    .actions {
      display: flex;
      gap: 0.5rem;
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
    .btn-edit {
      background: rgba(76, 175, 80, 0.15);
      border-color: rgba(76, 175, 80, 0.3);
      color: #4CAF50;
    }
    .btn-edit:hover {
      background: rgba(76, 175, 80, 0.3);
      border-color: rgba(76, 175, 80, 0.5);
      transform: scale(1.1);
      color: #66BB6A;
    }
    .btn-view {
      background: rgba(33, 150, 243, 0.15);
      border: 1px solid rgba(33, 150, 243, 0.3);
      color: #2196F3;
    }
    .btn-view:hover {
      background: rgba(33, 150, 243, 0.3);
      border-color: rgba(33, 150, 243, 0.5);
      transform: scale(1.1);
      color: #42A5F5;
    }
    .btn-delete {
      background: rgba(255, 68, 68, 0.15);
      border: 1px solid rgba(255, 68, 68, 0.3);
      color: #ff4444;
    }
    .btn-delete:hover {
      background: rgba(255, 68, 68, 0.3);
      border-color: rgba(255, 68, 68, 0.5);
      transform: scale(1.1);
      color: #ff6666;
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
      border-bottom: 1px solid rgba(255, 165, 0, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h2 {
      margin: 0;
      color: #FFA500;
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
      background: rgba(255, 165, 0, 0.1);
      color: #FFA500;
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
    .form-input,
    .form-textarea {
      width: 100%;
      padding: 1rem;
      background: #0F0F0F;
      border: 1px solid rgba(255, 165, 0, 0.3);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
      font-family: inherit;
    }
    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #FFA500;
      box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
    }
    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 165, 0, 0.15);
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
      justify-content: center;
      align-items: center;
      gap: 1.5rem;
      margin-top: 2rem;
      padding: 1.5rem;
    }
    .pagination-btn {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }
    .pagination-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
    }
    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pagination-info {
      color: #FF6B35;
      font-weight: 600;
      min-width: 150px;
      text-align: center;
    }
  `]
})
export class GestionClientsComponent implements OnInit {
  clients: any[] = [];
  clientsFiltres: any[] = [];
  searchTerm = '';
  modalOpen = false;
  loading = false;
  clientEdit: any = null;
  confirmSupprimerOpen = false;
  clientASupprimer: number | null = null;
  currentPage = 1;
  pageSize = 10;
  formData = {
    nom: '',
    prenom: '',
    telephone: '',
    adresse: ''
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.chargerClients();
  }

  chargerClients() {
    this.http.get<any[]>('https://final-resto.onrender.com/api/clients').subscribe({
      next: (data) => {
        this.clients = data || [];
        this.clientsFiltres = this.clients;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.clients = [];
        this.clientsFiltres = [];
        this.notificationService.error('Erreur lors du chargement des clients. Veuillez rafraîchir la page.');
      }
    });
  }

  filtrerClients() {
    if (!this.searchTerm.trim()) {
      this.clientsFiltres = this.clients;
      this.currentPage = 1;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.clientsFiltres = this.clients.filter(client =>
      client.nom.toLowerCase().includes(term) ||
      (client.prenom && client.prenom.toLowerCase().includes(term)) ||
      (client.telephone && client.telephone.includes(term))
    );
    this.currentPage = 1;
  }

  getClientsPagines() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.clientsFiltres.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.clientsFiltres.length / this.pageSize);
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

  ouvrirModal() {
    this.clientEdit = null;
    this.formData = { nom: '', prenom: '', telephone: '', adresse: '' };
    this.modalOpen = true;
  }

  fermerModal() {
    this.modalOpen = false;
    this.clientEdit = null;
    this.loading = false;
  }

  editerClient(client: any) {
    this.clientEdit = client;
    this.formData = {
      nom: client.nom,
      prenom: client.prenom || '',
      telephone: client.telephone || '',
      adresse: client.adresse || ''
    };
    this.modalOpen = true;
  }

  sauvegarderClient() {
    if (!this.formData.nom || this.formData.nom.trim() === '') {
      this.notificationService.warning('Le nom est requis.');
      return;
    }
    if (!this.formData.telephone || this.formData.telephone.trim() === '') {
      this.notificationService.warning('Le téléphone est requis.');
      return;
    }

    this.loading = true;
    const url = this.clientEdit 
      ? `https://final-resto.onrender.com/api/clients/${this.clientEdit.idClient}`
      : 'https://final-resto.onrender.com/api/clients';
    
    const request = this.clientEdit 
      ? this.http.put<any>(url, this.formData)
      : this.http.post<any>(url, this.formData);
    
    request.subscribe({
      next: () => {
        this.notificationService.success(this.clientEdit ? 'Client modifié avec succès !' : 'Client ajouté avec succès !');
        this.chargerClients();
        this.fermerModal();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
        this.notificationService.error('Erreur lors de l\'enregistrement.');
      }
    });
  }

  voirDetails(client: any) {
    this.editerClient(client);
  }

  supprimerClient(id: number) {
    this.clientASupprimer = id;
    this.confirmSupprimerOpen = true;
  }

  confirmerSuppression() {
    if (this.clientASupprimer) {
      this.http.delete(`https://final-resto.onrender.com/api/clients/${this.clientASupprimer}`).subscribe({
        next: () => {
          this.notificationService.success('Client supprimé avec succès !');
          this.chargerClients();
          this.confirmSupprimerOpen = false;
          this.clientASupprimer = null;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.notificationService.error('Erreur lors de la suppression. Veuillez réessayer.');
          this.confirmSupprimerOpen = false;
          this.clientASupprimer = null;
        }
      });
    }
  }
}
