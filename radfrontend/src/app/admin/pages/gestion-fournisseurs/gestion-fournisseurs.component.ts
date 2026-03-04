import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-gestion-fournisseurs',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="gestion-fournisseurs">
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fas fa-truck"></i> Gestion des Fournisseurs</h1>
          <p class="subtitle">Liste de tous vos fournisseurs</p>
        </div>
        <button class="btn-primary" (click)="ouvrirModal()">
          <i class="fas fa-plus"></i> Ajouter un fournisseur
        </button>
      </div>
      
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Rechercher un fournisseur..." 
          [(ngModel)]="searchTerm"
          (input)="filtrerFournisseurs()"
          class="search-input"
        />
        <div class="stats-info">
          <span class="stat-badge">{{ fournisseursFiltres.length }} fournisseur{{ fournisseursFiltres.length > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des fournisseurs...</p>
      </div>

      <div class="table-wrapper" *ngIf="!loading">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let fournisseur of getFournisseursPagines()">
              <td><span class="id-badge">#{{ fournisseur.idFournisseur }}</span></td>
              <td><strong>{{ fournisseur.nom }}</strong></td>
              <td>{{ fournisseur.contact || '-' }}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon btn-edit" (click)="editerFournisseur(fournisseur)" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon btn-delete" (click)="supprimerFournisseur(fournisseur.idFournisseur!)" title="Supprimer">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="fournisseursFiltres.length === 0 && !loading">
              <td colspan="4" class="empty-state">
                <div class="empty-icon"><i class="fas fa-truck"></i></div>
                <p>{{ searchTerm ? 'Aucun fournisseur trouvé' : 'Aucun fournisseur enregistré' }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="fournisseursFiltres.length > pageSize && !loading">
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

      <!-- Modal pour créer/modifier un fournisseur -->
      <div class="modal" [class.open]="modalOpen" (click)="fermerModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <i class="fas" [class.fa-edit]="fournisseurEdit" [class.fa-plus]="!fournisseurEdit"></i> 
              {{ fournisseurEdit ? 'Modifier' : 'Ajouter' }} un fournisseur
            </h2>
            <button class="close-btn" (click)="fermerModal()"><i class="fas fa-times"></i></button>
          </div>
          <form (ngSubmit)="sauvegarderFournisseur()" class="modal-form">
            <div class="form-group">
              <label>Nom *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.nom" 
                name="nom" 
                required
                placeholder="Ex: Fournisseur ABC"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Contact</label>
              <input 
                type="text" 
                [(ngModel)]="formData.contact" 
                name="contact" 
                placeholder="Ex: +221 77 123 45 67"
                class="form-input"
              />
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
      title="Supprimer le fournisseur"
      message="Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible."
      confirmText="Oui, supprimer"
      cancelText="Annuler"
      type="warning"
      (confirmed)="confirmerSuppression()"
      (cancelled)="confirmSupprimerOpen = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .gestion-fournisseurs {
      color: white;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 2rem;
    }
    .header-content h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .subtitle {
      margin: 0;
      color: #999;
      font-size: 0.95rem;
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
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #999;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 107, 53, 0.2);
      border-top-color: #FF6B35;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
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
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-icon {
      font-size: 1rem;
    }
    .btn-icon.btn-edit,
    .btn-icon.btn-delete {
      border: 1px solid;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0.6rem;
      border-radius: 8px;
      transition: all 0.2s ease;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
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
    }
    .btn-delete {
      background: rgba(255, 68, 68, 0.15);
      border-color: rgba(255, 68, 68, 0.3);
      color: #ff4444;
    }
    .btn-delete:hover {
      background: rgba(255, 68, 68, 0.3);
      border-color: rgba(255, 68, 68, 0.5);
      transform: scale(1.1);
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
      color: #999;
    }
    .empty-state p {
      color: #999;
      margin: 0.5rem 0;
      font-size: 1rem;
    }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      backdrop-filter: blur(5px);
      overflow-y: auto;
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
      margin: 2rem auto;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      padding: 2rem 2rem 1.5rem;
      border-bottom: 1px solid rgba(255, 107, 53, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      z-index: 1;
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
export class GestionFournisseursComponent implements OnInit {
  fournisseurs: any[] = [];
  fournisseursFiltres: any[] = [];
  searchTerm = '';
  modalOpen = false;
  loading = false;
  fournisseurEdit: any = null;
  confirmSupprimerOpen = false;
  fournisseurASupprimer: number | null = null;
  currentPage = 1;
  pageSize = 10;
  formData = {
    nom: '',
    contact: ''
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.chargerFournisseurs();
  }

  chargerFournisseurs() {
    this.loading = true;
    this.http.get<any[]>('http://localhost:8080/api/fournisseurs').subscribe({
      next: (data) => {
        this.fournisseurs = data || [];
        this.fournisseursFiltres = this.fournisseurs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.fournisseurs = [];
        this.fournisseursFiltres = [];
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement des fournisseurs. Veuillez rafraîchir la page.');
      }
    });
  }

  filtrerFournisseurs() {
    if (!this.searchTerm.trim()) {
      this.fournisseursFiltres = this.fournisseurs;
      this.currentPage = 1;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.fournisseursFiltres = this.fournisseurs.filter(f =>
      f.nom.toLowerCase().includes(term) ||
      (f.contact && f.contact.toLowerCase().includes(term))
    );
    this.currentPage = 1;
  }

  getFournisseursPagines() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.fournisseursFiltres.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.fournisseursFiltres.length / this.pageSize);
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
    this.fournisseurEdit = null;
    this.formData = { nom: '', contact: '' };
    this.modalOpen = true;
  }

  editerFournisseur(fournisseur: any) {
    this.fournisseurEdit = fournisseur;
    this.formData = {
      nom: fournisseur.nom,
      contact: fournisseur.contact || ''
    };
    this.modalOpen = true;
  }

  fermerModal() {
    this.modalOpen = false;
    this.fournisseurEdit = null;
    this.loading = false;
  }

  sauvegarderFournisseur() {
    if (!this.formData.nom || this.formData.nom.trim() === '') {
      this.notificationService.warning('Le nom du fournisseur est requis.');
      return;
    }

    this.loading = true;
    const url = this.fournisseurEdit 
      ? `http://localhost:8080/api/fournisseurs/${this.fournisseurEdit.idFournisseur}`
      : 'http://localhost:8080/api/fournisseurs';
    
    const request = this.fournisseurEdit 
      ? this.http.put<any>(url, this.formData)
      : this.http.post<any>(url, this.formData);
    
    request.subscribe({
      next: () => {
        this.notificationService.success(this.fournisseurEdit ? 'Fournisseur modifié avec succès !' : 'Fournisseur ajouté avec succès !');
        this.chargerFournisseurs();
        this.fermerModal();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
        const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
        this.notificationService.error(`Erreur lors de l'enregistrement. ${errorMsg}`);
      }
    });
  }

  supprimerFournisseur(id: number) {
    this.fournisseurASupprimer = id;
    this.confirmSupprimerOpen = true;
  }

  confirmerSuppression() {
    if (this.fournisseurASupprimer) {
      this.http.delete(`http://localhost:8080/api/fournisseurs/${this.fournisseurASupprimer}`).subscribe({
        next: () => {
          this.notificationService.success('Fournisseur supprimé avec succès !');
          this.chargerFournisseurs();
          this.confirmSupprimerOpen = false;
          this.fournisseurASupprimer = null;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.notificationService.error('Erreur lors de la suppression. Veuillez réessayer.');
          this.confirmSupprimerOpen = false;
          this.fournisseurASupprimer = null;
        }
      });
    }
  }
}





