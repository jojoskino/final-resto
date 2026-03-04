import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-gestion-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gestion-stock">
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fas fa-boxes"></i> Gestion du Stock</h1>
          <p class="subtitle">Suivez et gérez votre inventaire</p>
        </div>
        <button class="btn-primary" (click)="ouvrirModal()">
          <i class="fas fa-plus btn-icon"></i>
          <span>Ajouter un produit</span>
        </button>
      </div>

      <div *ngIf="loading && stocks.length === 0" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement du stock...</p>
      </div>

      <div class="table-wrapper" *ngIf="!loading">
        <div *ngIf="loading && stocks.length > 0" class="loading-overlay">
          <div class="spinner-small"></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produit</th>
              <th>Prix (FCFA)</th>
              <th>Quantité</th>
              <th>Seuil</th>
              <th>Fournisseur</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let stock of getStocksPagines()" [class.low-stock]="stock.quantite < (stock.seuil || 10)">
              <td><span class="id-badge">#{{ stock.idStock }}</span></td>
              <td>
                <div class="produit-name">{{ stock.produit?.nom || 'N/A' }}</div>
              </td>
              <td><span class="prix">{{ stock.produit?.prix | number }}</span></td>
              <td>
                <span class="quantity-value" [class.low]="stock.quantite < (stock.seuil || 10)">
                  {{ stock.quantite }}
                </span>
              </td>
              <td>{{ stock.seuil || 10 }}</td>
              <td>{{ stock.fournisseur?.nom || '-' }}</td>
              <td>
                <span class="badge" [class.badge-warning]="stock.quantite < (stock.seuil || 10)" [class.badge-success]="stock.quantite >= (stock.seuil || 10)">
                  <i class="fas" [class.fa-exclamation-triangle]="stock.quantite < (stock.seuil || 10)" [class.fa-check]="stock.quantite >= (stock.seuil || 10)"></i>
                  {{ stock.quantite < (stock.seuil || 10) ? ' Faible' : ' OK' }}
                </span>
              </td>
              <td>
                <button class="btn-icon btn-edit" (click)="editerStock(stock)" title="Modifier">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="stocks.length === 0">
              <td colspan="8" class="empty-state">
                <div class="empty-icon"><i class="fas fa-boxes"></i></div>
                <p>Aucun stock enregistré</p>
                <button class="btn-primary" (click)="ouvrirModal()">
                  Ajouter le premier produit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="stocks.length > pageSize">
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
              <i class="fas" [class.fa-edit]="stockEdit" [class.fa-plus]="!stockEdit"></i> 
              {{ stockEdit ? 'Modifier' : 'Ajouter' }} un stock
            </h2>
            <button class="close-btn" (click)="fermerModal()"><i class="fas fa-times"></i></button>
          </div>
          <form (ngSubmit)="sauvegarderStock()" class="modal-form">
            <div class="form-group">
              <label>Nom du produit *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.nomProduit" 
                name="nomProduit" 
                required
                placeholder="Ex: Riz"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Prix du produit (FCFA) *</label>
              <input 
                type="number" 
                [(ngModel)]="formData.prixProduit" 
                name="prixProduit" 
                required
                step="0.01"
                min="0"
                placeholder="0"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Quantité *</label>
              <input 
                type="number" 
                [(ngModel)]="formData.quantite" 
                name="quantite" 
                required
                min="0"
                placeholder="0"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Seuil d'alerte *</label>
              <input 
                type="number" 
                [(ngModel)]="formData.seuil" 
                name="seuil" 
                required
                min="0"
                placeholder="10"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Fournisseur *</label>
              <select 
                [(ngModel)]="formData.fournisseurId" 
                name="fournisseurId" 
                required
                class="form-input"
              >
                <option value="">Sélectionner un fournisseur</option>
                <option *ngFor="let fournisseur of fournisseurs" [value]="fournisseur.idFournisseur">
                  {{ fournisseur.nom }}
                </option>
              </select>
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
  `,
  styles: [`
    .gestion-stock {
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
    .table-wrapper {
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      border-radius: 16px;
      border: 1px solid rgba(255, 107, 53, 0.15);
      overflow: hidden;
      position: relative;
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
    .low-stock {
      background: rgba(255, 68, 68, 0.05);
    }
    .id-badge {
      background: rgba(255, 107, 53, 0.2);
      color: #FF6B35;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .produit-name {
      font-weight: 600;
      color: white;
    }
    .prix {
      font-weight: 700;
      color: #FF6B35;
    }
    .quantity-value {
      font-weight: 700;
      font-size: 1.1rem;
      color: #4CAF50;
    }
    .quantity-value.low {
      color: #ff4444;
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
      background: rgba(255, 68, 68, 0.2);
      color: #ff4444;
    }
    .btn-icon {
      font-size: 1rem;
    }
    .btn-icon.btn-edit {
      background: rgba(76, 175, 80, 0.15);
      border: 1px solid rgba(76, 175, 80, 0.3);
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
      color: #4CAF50;
    }
    .btn-edit:hover {
      background: rgba(76, 175, 80, 0.3);
      border-color: rgba(76, 175, 80, 0.5);
      transform: scale(1.1);
      color: #66BB6A;
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
      margin: 0.5rem 0 1.5rem;
      font-size: 1rem;
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
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(26, 26, 26, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      border-radius: 16px;
    }
    .spinner-small {
      width: 30px;
      height: 30px;
      border: 3px solid rgba(255, 107, 53, 0.2);
      border-top-color: #FF6B35;
      border-radius: 50%;
      animation: spin 1s linear infinite;
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
      max-width: 500px;
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
    .panier-content::-webkit-scrollbar {
      width: 8px;
    }
    .panier-content::-webkit-scrollbar-track {
      background: #1A1A1A;
      border-radius: 10px;
    }
    .panier-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      border-radius: 10px;
    }
    .panier-content::-webkit-scrollbar-thumb:hover {
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
export class GestionStockComponent implements OnInit {
  stocks: any[] = [];
  fournisseurs: any[] = [];
  modalOpen = false;
  loading = false;
  stockEdit: any = null;
  currentPage = 1;
  pageSize = 10;
  formData = {
    nomProduit: '',
    prixProduit: 0,
    quantite: 0,
    seuil: 10,
    fournisseurId: null as number | null
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.chargerStocks();
    this.chargerFournisseurs();
  }

  chargerFournisseurs() {
    this.http.get<any[]>('https://final-resto.onrender.com/api/fournisseurs').subscribe({
      next: (data) => {
        this.fournisseurs = data || [];
      },
      error: (err) => {
        console.error('Erreur chargement fournisseurs:', err);
        this.fournisseurs = [];
      }
    });
  }

  chargerStocks() {
    this.loading = true;
    this.http.get<any[]>('https://final-resto.onrender.com/api/stocks').subscribe({
      next: (data) => {
        this.stocks = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.stocks = [];
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement du stock. Veuillez rafraîchir la page.');
      }
    });
  }

  ouvrirModal() {
    this.stockEdit = null;
    this.formData = { 
      nomProduit: '', 
      prixProduit: 0, 
      quantite: 0, 
      seuil: 10, 
      fournisseurId: null 
    };
    (this.formData as any).produitId = null;
    this.modalOpen = true;
  }

  editerStock(stock: any) {
    this.stockEdit = stock;
    this.formData = {
      nomProduit: stock.produit?.nom || '',
      prixProduit: stock.produit?.prix || 0,
      quantite: stock.quantite,
      seuil: stock.seuil || 10,
      fournisseurId: stock.fournisseur?.idFournisseur || null
    };
    // Store the product ID for update
    (this.formData as any).produitId = stock.produit?.idProduit || null;
    this.modalOpen = true;
  }

  fermerModal() {
    this.modalOpen = false;
    this.stockEdit = null;
    this.loading = false;
  }

  sauvegarderStock() {
    // Validations
    if (!this.formData.nomProduit || this.formData.nomProduit.trim() === '') {
      this.notificationService.warning('Le nom du produit est requis.');
      return;
    }
    if (!this.formData.prixProduit || this.formData.prixProduit <= 0) {
      this.notificationService.warning('Le prix doit être supérieur à 0.');
      return;
    }
    if (!this.formData.quantite || this.formData.quantite < 0) {
      this.notificationService.warning('La quantité doit être supérieure ou égale à 0.');
      return;
    }
    if (!this.formData.seuil || this.formData.seuil < 0) {
      this.notificationService.warning('Le seuil doit être supérieur ou égal à 0.');
      return;
    }
    if (!this.formData.fournisseurId) {
      this.notificationService.warning('Veuillez sélectionner un fournisseur.');
      return;
    }

    this.loading = true;
    
    // Prepare product data
    const produitData: any = {
      nom: this.formData.nomProduit,
      prix: this.formData.prixProduit
    };
    
    // If editing and product exists, include the ID
    if (this.stockEdit && (this.formData as any).produitId) {
      produitData.idProduit = (this.formData as any).produitId;
    }
    
    const stockData = {
      produit: produitData,
      quantite: this.formData.quantite,
      seuil: this.formData.seuil,
      fournisseur: { idFournisseur: this.formData.fournisseurId }
    };
    
    const url = this.stockEdit 
      ? `https://final-resto.onrender.com/api/stocks/${this.stockEdit.idStock}`
      : 'https://final-resto.onrender.com/api/stocks';
    
    const request = this.stockEdit 
      ? this.http.put<any>(url, stockData)
      : this.http.post<any>(url, stockData);
    
    request.subscribe({
      next: () => {
        this.notificationService.success(this.stockEdit ? 'Stock modifié avec succès !' : 'Stock ajouté avec succès !');
        this.chargerStocks();
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

  getStocksPagines() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.stocks.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.stocks.length / this.pageSize);
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
