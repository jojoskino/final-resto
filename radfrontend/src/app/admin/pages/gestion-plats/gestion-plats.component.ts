import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PlatService } from '../../../services/plat.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-gestion-plats',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="gestion-plats">
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fas fa-utensils"></i> Gestion des Plats</h1>
          <p class="subtitle">Gérez votre menu et vos plats</p>
        </div>
        <button class="btn-primary" (click)="ouvrirModal()">
          <i class="fas fa-plus btn-icon"></i>
          <span>Ajouter un plat</span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-bar">
        <input 
          type="text" 
          placeholder="Rechercher un plat..." 
          [(ngModel)]="searchTerm"
          (input)="filtrerPlats()"
          class="search-input"
        />
        <div class="stats-info">
          <span class="stat-badge">{{ platsFiltres.length }} plat{{ platsFiltres.length > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Catégorie</th>
              <th>Prix (FCFA)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let plat of getPlatsPageines()">
              <td><span class="id-badge">#{{ plat.idPlat }}</span></td>
              <td>
                <div class="plat-name">{{ plat.nom }}</div>
              </td>
              <td>
                <div class="plat-description">{{ plat.description || '-' }}</div>
              </td>
              <td>
                <span class="categorie-badge" *ngIf="plat.categorie">{{ plat.categorie.nom }}</span>
                <span class="categorie-badge empty" *ngIf="!plat.categorie">Non catégorisé</span>
              </td>
              <td>
                <span class="prix">{{ plat.prix | number }}</span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-icon btn-edit" (click)="editerPlat(plat)" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon btn-delete" (click)="supprimerPlat(plat.idPlat!)" title="Supprimer">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="platsFiltres.length === 0">
              <td colspan="6" class="empty-state">
                <div class="empty-icon"><i class="fas fa-utensils"></i></div>
                <p>{{ searchTerm ? 'Aucun plat trouvé' : 'Aucun plat enregistré' }}</p>
                <button *ngIf="!searchTerm" class="btn-primary" (click)="ouvrirModal()">
                  Ajouter le premier plat
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="platsFiltres.length > pageSize">
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
              <i class="fas" [class.fa-edit]="platEdit" [class.fa-plus]="!platEdit"></i> 
              {{ platEdit ? 'Modifier' : 'Ajouter' }} un plat
            </h2>
            <button class="close-btn" (click)="fermerModal()"><i class="fas fa-times"></i></button>
          </div>
          <form (ngSubmit)="sauvegarderPlat()" class="modal-form">
            <div class="form-group">
              <label>Nom du plat *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.nom" 
                name="nom" 
                required
                placeholder="Ex: Poulet Yassa"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Description *</label>
              <textarea 
                [(ngModel)]="formData.description" 
                name="description" 
                required 
                rows="4"
                placeholder="Décrivez le plat..."
                class="form-textarea"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Prix (FCFA) *</label>
              <input 
                type="number" 
                [(ngModel)]="formData.prix" 
                name="prix" 
                required 
                step="0.01"
                min="0"
                placeholder="0"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Catégorie *</label>
              <select 
                [(ngModel)]="formData.categorieId" 
                name="categorieId" 
                required
                class="form-input"
              >
                <option value="">Sélectionner une catégorie</option>
                <option *ngFor="let categorie of categories" [value]="categorie.id">
                  {{ categorie.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Photo du plat</label>
              <div class="image-upload-container">
                <input 
                  type="file" 
                  #fileInput
                  (change)="onFileSelected($event)"
                  accept="image/*"
                  class="file-input"
                  id="imageUpload"
                />
                <label for="imageUpload" class="file-label">
                  <i class="fas fa-upload"></i>
                  <span *ngIf="!formData.imageUrl">Choisir une image</span>
                  <span *ngIf="formData.imageUrl">Changer l'image</span>
                </label>
                <div *ngIf="formData.imageUrl" class="image-preview">
                  <img [src]="formData.imageUrl" alt="Preview" />
                  <button type="button" class="btn-remove-image" (click)="removeImage()">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div *ngIf="uploading" class="upload-progress">
                  <div class="spinner-small"></div>
                  <span>Upload en cours...</span>
                </div>
              </div>
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
      title="Supprimer le plat"
      message="Êtes-vous sûr de vouloir supprimer ce plat ? Cette action est irréversible."
      confirmText="Oui, supprimer"
      cancelText="Annuler"
      type="warning"
      (confirmed)="confirmerSuppression()"
      (cancelled)="confirmSupprimerOpen = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .gestion-plats {
      color: white;
    }

    /* Page Header */
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
    .btn-icon {
      font-size: 1.1rem;
    }

    /* Search Bar */
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

    /* Table */
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
    .plat-name {
      font-weight: 600;
      color: white;
    }
    .plat-description {
      color: #999;
      font-size: 0.9rem;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .prix {
      font-weight: 700;
      color: #FF6B35;
      font-size: 1.05rem;
    }
    .categorie-badge {
      background: rgba(255, 165, 0, 0.2);
      color: #FFA500;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .categorie-badge.empty {
      background: rgba(153, 153, 153, 0.2);
      color: #999;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      display: inline-block;
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

    /* Empty State */
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
      margin: 0.5rem 0 1.5rem;
      font-size: 1rem;
    }

    /* Modal */
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
      min-height: 100px;
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
    .image-upload-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .file-input {
      display: none;
    }
    .file-label {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(255, 107, 53, 0.1);
      border: 2px dashed rgba(255, 107, 53, 0.3);
      border-radius: 12px;
      color: #FF6B35;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 600;
    }
    .file-label:hover {
      background: rgba(255, 107, 53, 0.2);
      border-color: rgba(255, 107, 53, 0.5);
    }
    .image-preview {
      position: relative;
      width: 100%;
      max-width: 300px;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid rgba(255, 107, 53, 0.3);
    }
    .image-preview img {
      width: 100%;
      height: auto;
      display: block;
    }
    .btn-remove-image {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(244, 67, 54, 0.9);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .btn-remove-image:hover {
      background: rgba(244, 67, 54, 1);
      transform: scale(1.1);
    }
    .upload-progress {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #FF6B35;
      font-size: 0.9rem;
    }
    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 107, 53, 0.2);
      border-top-color: #FF6B35;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
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

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
      }
      .search-bar {
        flex-direction: column;
      }
      .table-wrapper {
        overflow-x: auto;
      }
      table {
        min-width: 800px;
      }
    }
  `]
})
export class GestionPlatsComponent implements OnInit {
  plats: any[] = [];
  platsFiltres: any[] = [];
  searchTerm = '';
  modalOpen = false;
  loading = false;
  platEdit: any = null;
  confirmSupprimerOpen = false;
  platASupprimer: number | null = null;
  categories: any[] = [];
  uploading = false;
  currentPage = 1;
  pageSize = 10;
  formData = {
    nom: '',
    description: '',
    prix: 0,
    categorieId: null as number | null,
    imageUrl: '' as string | null
  };

  constructor(
    private http: HttpClient,
    private platService: PlatService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.chargerPlats();
    this.chargerCategories();
  }

  chargerPlats() {
    this.platService.getAllPlats().subscribe({
      next: (data) => {
        this.plats = data || [];
        this.platsFiltres = this.plats;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.plats = [];
        this.platsFiltres = [];
        this.notificationService.error('Erreur lors du chargement des plats. Veuillez rafraîchir la page.');
      }
    });
  }

  chargerCategories() {
    this.platService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data || [];
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
      }
    });
  }

  filtrerPlats() {
    if (!this.searchTerm.trim()) {
      this.platsFiltres = this.plats;
      this.currentPage = 1;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.platsFiltres = this.plats.filter(plat =>
      plat.nom.toLowerCase().includes(term) ||
      (plat.description && plat.description.toLowerCase().includes(term))
    );
    this.currentPage = 1;
  }

  getPlatsPageines() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.platsFiltres.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.platsFiltres.length / this.pageSize);
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
    this.platEdit = null;
    this.formData = { nom: '', description: '', prix: 0, categorieId: null, imageUrl: null };
    this.uploading = false;
    this.modalOpen = true;
  }

  editerPlat(plat: any) {
    this.platEdit = plat;
    this.formData = {
      nom: plat.nom,
      description: plat.description || '',
      prix: plat.prix,
      categorieId: plat.categorie?.id || null,
      imageUrl: plat.imageUrl || null
    };
    this.uploading = false;
    this.modalOpen = true;
  }

  fermerModal() {
    this.modalOpen = false;
    this.platEdit = null;
    this.loading = false;
  }

  sauvegarderPlat() {
    // Validations
    if (!this.formData.nom || this.formData.nom.trim() === '') {
      this.notificationService.warning('Le nom du plat est requis.');
      return;
    }
    if (!this.formData.description || this.formData.description.trim() === '') {
      this.notificationService.warning('La description du plat est requise.');
      return;
    }
    if (!this.formData.prix || this.formData.prix <= 0) {
      this.notificationService.warning('Le prix doit être supérieur à 0.');
      return;
    }

    if (!this.formData.categorieId) {
      this.notificationService.warning('Veuillez sélectionner une catégorie.');
      return;
    }

    this.loading = true;
    const platData: any = {
      nom: this.formData.nom,
      description: this.formData.description,
      prix: this.formData.prix,
      categorie: { id: this.formData.categorieId }
    };
    
    if (this.formData.imageUrl) {
      platData.imageUrl = this.formData.imageUrl;
    }
    
    const url = this.platEdit 
      ? `https://final-resto.onrender.com/api/plats/${this.platEdit.idPlat}`
      : 'https://final-resto.onrender.com/api/plats';
    
    const request = this.platEdit 
      ? this.http.put<any>(url, platData)
      : this.http.post<any>(url, platData);
    
    request.subscribe({
      next: () => {
        this.notificationService.success(this.platEdit ? 'Plat modifié avec succès !' : 'Plat ajouté avec succès !');
        this.chargerPlats();
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

  supprimerPlat(id: number) {
    this.platASupprimer = id;
    this.confirmSupprimerOpen = true;
  }

  confirmerSuppression() {
    if (this.platASupprimer) {
      this.http.delete(`https://final-resto.onrender.com/api/plats/${this.platASupprimer}`).subscribe({
        next: () => {
          this.notificationService.success('Plat supprimé avec succès !');
          this.chargerPlats();
          this.confirmSupprimerOpen = false;
          this.platASupprimer = null;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.notificationService.error('Erreur lors de la suppression. Veuillez réessayer.');
          this.confirmSupprimerOpen = false;
          this.platASupprimer = null;
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.notificationService.warning('Veuillez sélectionner un fichier image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.notificationService.warning('L\'image ne doit pas dépasser 10MB.');
      return;
    }

    this.uploading = true;
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{imageUrl: string}>('https://final-resto.onrender.com/api/upload/image', formData).subscribe({
      next: (response) => {
        this.formData.imageUrl = 'https://final-resto.onrender.com' + response.imageUrl;
        this.uploading = false;
        this.notificationService.success('Image uploadée avec succès !');
      },
      error: (err) => {
        console.error('Erreur upload:', err);
        this.uploading = false;
        this.notificationService.error('Erreur lors de l\'upload de l\'image.');
      }
    });
  }

  removeImage() {
    this.formData.imageUrl = null;
  }
}
