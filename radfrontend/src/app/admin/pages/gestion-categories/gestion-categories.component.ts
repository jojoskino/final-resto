import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-gestion-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="gestion-categories">
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fas fa-tags"></i> Gestion des Catégories</h1>
          <p class="subtitle">Organisez vos plats par catégories</p>
        </div>
        <button class="btn-primary" (click)="ouvrirModal()">
          <i class="fas fa-plus btn-icon"></i>
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Rechercher une catégorie..." 
          [(ngModel)]="searchTerm"
          (input)="filtrerCategories()"
          class="search-input"
        />
        <div class="stats-info">
          <span class="stat-badge">{{ categoriesFiltrees.length }} catégorie{{ categoriesFiltrees.length > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let categorie of getCategoriesPaginees()">
              <td><span class="id-badge">#{{ categorie.id }}</span></td>
              <td>
                <div class="categorie-name">{{ categorie.nom }}</div>
              </td>
              <td>
                <div class="categorie-description">{{ categorie.description || '-' }}</div>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-icon btn-edit" (click)="editerCategorie(categorie)" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon btn-delete" (click)="supprimerCategorie(categorie.id!)" title="Supprimer">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="categoriesFiltrees.length === 0">
              <td colspan="4" class="empty-state">
                <div class="empty-icon"><i class="fas fa-tags"></i></div>
                <p>{{ searchTerm ? 'Aucune catégorie trouvée' : 'Aucune catégorie enregistrée' }}</p>
                <button *ngIf="!searchTerm" class="btn-primary" (click)="ouvrirModal()">
                  Ajouter la première catégorie
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="categoriesFiltrees.length > pageSize">
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

      <!-- Modal -->
      <div class="modal" [class.open]="modalOpen" (click)="fermerModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <i class="fas" [class.fa-edit]="categorieEdit" [class.fa-plus]="!categorieEdit"></i> 
              {{ categorieEdit ? 'Modifier' : 'Ajouter' }} une catégorie
            </h2>
            <button class="close-btn" (click)="fermerModal()"><i class="fas fa-times"></i></button>
          </div>
          <form (ngSubmit)="sauvegarderCategorie()" class="modal-form">
            <div class="form-group">
              <label>Nom de la catégorie *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.nom" 
                name="nom" 
                required
                placeholder="Ex: Entrées"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea 
                [(ngModel)]="formData.description" 
                name="description" 
                rows="3"
                placeholder="Description de la catégorie..."
                class="form-textarea"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="fermerModal()">
                Annuler
              </button>
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
      title="Supprimer la catégorie"
      message="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
      confirmText="Oui, supprimer"
      cancelText="Annuler"
      type="warning"
      (confirmed)="confirmerSuppression()"
      (cancelled)="confirmSupprimerOpen = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .gestion-categories {
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
    .categorie-name {
      font-weight: 600;
      color: white;
    }
    .categorie-description {
      color: #999;
      font-size: 0.9rem;
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      color: #66BB6A;
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
      color: #ff6666;
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
      margin: 0.5rem 0 1.5rem;
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
      line-height: 1;
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
    .form-input,
    .form-textarea {
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
    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #FF6B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
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
export class GestionCategoriesComponent implements OnInit {
  categories: any[] = [];
  categoriesFiltrees: any[] = [];
  searchTerm = '';
  modalOpen = false;
  loading = false;
  categorieEdit: any = null;
  confirmSupprimerOpen = false;
  categorieASupprimer: number | null = null;
  currentPage = 1;
  pageSize = 10;
  formData = {
    nom: '',
    description: ''
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.chargerCategories();
  }

  chargerCategories() {
    this.http.get<any[]>('https://final-resto.onrender.com/api/categories').subscribe({
      next: (data) => {
        this.categories = data;
        this.categoriesFiltrees = data;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.categories = [];
        this.categoriesFiltrees = [];
      }
    });
  }

  filtrerCategories() {
    if (!this.searchTerm.trim()) {
      this.categoriesFiltrees = this.categories;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.categoriesFiltrees = this.categories.filter(categorie =>
        categorie.nom.toLowerCase().includes(term) ||
        (categorie.description && categorie.description.toLowerCase().includes(term))
      );
    }
    this.currentPage = 1;
  }

  ouvrirModal() {
    this.categorieEdit = null;
    this.formData = { nom: '', description: '' };
    this.modalOpen = true;
  }

  editerCategorie(categorie: any) {
    this.categorieEdit = categorie;
    this.formData = {
      nom: categorie.nom,
      description: categorie.description || ''
    };
    this.modalOpen = true;
  }

  fermerModal() {
    this.modalOpen = false;
    this.categorieEdit = null;
    this.loading = false;
  }

  sauvegarderCategorie() {
    // Validations
    if (!this.formData.nom || this.formData.nom.trim() === '') {
      this.notificationService.warning('Le nom de la catégorie est requis.');
      return;
    }

    this.loading = true;
    const url = this.categorieEdit 
      ? `https://final-resto.onrender.com/api/categories/${this.categorieEdit.id}`
      : 'https://final-resto.onrender.com/api/categories';
    
    const request = this.categorieEdit 
      ? this.http.put<any>(url, this.formData)
      : this.http.post<any>(url, this.formData);
    
    request.subscribe({
      next: () => {
        this.notificationService.success(this.categorieEdit ? 'Catégorie modifiée avec succès !' : 'Catégorie ajoutée avec succès !');
        this.chargerCategories();
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

  supprimerCategorie(id: number) {
    this.categorieASupprimer = id;
    this.confirmSupprimerOpen = true;
  }

  confirmerSuppression() {
    if (this.categorieASupprimer) {
      this.http.delete(`https://final-resto.onrender.com/api/categories/${this.categorieASupprimer}`).subscribe({
        next: () => {
          this.notificationService.success('Catégorie supprimée avec succès !');
          this.chargerCategories();
          this.confirmSupprimerOpen = false;
          this.categorieASupprimer = null;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.notificationService.error('Erreur lors de la suppression. Veuillez réessayer.');
          this.confirmSupprimerOpen = false;
          this.categorieASupprimer = null;
        }
      });
    }
  }

  getCategoriesPaginees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.categoriesFiltrees.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.categoriesFiltrees.length / this.pageSize);
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

