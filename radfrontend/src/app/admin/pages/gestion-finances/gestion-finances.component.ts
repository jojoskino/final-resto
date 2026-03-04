import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService, Depense, Vente, ResumeFinancier } from '../../../services/finance.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { NotificationService } from '../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-gestion-finances',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  template: `
    <div class="gestion-finances">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fas fa-chart-pie"></i> Gestion Financière</h1>
          <p class="subtitle">Vue d'ensemble des finances du restaurant</p>
        </div>
        <button class="btn-primary" (click)="ouvrirModalDepense()">
          <i class="fas fa-plus"></i> Ajouter une dépense
        </button>
      </div>

      <!-- Résumé Financier -->
      <div class="resume-grid" *ngIf="resume">
        <div class="resume-card ventes">
          <div class="card-icon">
            <i class="fas fa-arrow-up"></i>
          </div>
          <div class="card-content">
            <h3>Ventes Total</h3>
            <p class="card-value">{{ resume.totalVentes | number:'0.0-0' }}</p>
            <span class="card-subtitle">FCFA</span>
            <div class="card-detail">Ce mois: {{ resume.ventesMois | number:'0.0-0' }} FCFA</div>
          </div>
        </div>
        <div class="resume-card depenses">
          <div class="card-icon">
            <i class="fas fa-arrow-down"></i>
          </div>
          <div class="card-content">
            <h3>Dépenses Total</h3>
            <p class="card-value">{{ resume.totalDepenses | number:'0.0-0' }}</p>
            <span class="card-subtitle">FCFA</span>
            <div class="card-detail">Ce mois: {{ resume.depensesMois | number:'0.0-0' }} FCFA</div>
          </div>
        </div>
        <div class="resume-card benefice" [class.negatif]="resume.benefice < 0">
          <div class="card-icon">
            <i class="fas" [class.fa-chart-line]="resume.benefice >= 0" [class.fa-exclamation-triangle]="resume.benefice < 0"></i>
          </div>
          <div class="card-content">
            <h3>Bénéfice Net</h3>
            <p class="card-value">{{ resume.benefice | number:'0.0-0' }}</p>
            <span class="card-subtitle">FCFA</span>
            <div class="card-detail">Ce mois: {{ resume.beneficeMois | number:'0.0-0' }} FCFA</div>
          </div>
        </div>
        <div class="resume-card taux">
          <div class="card-icon">
            <i class="fas fa-percentage"></i>
          </div>
          <div class="card-content">
            <h3>Taux de Marge</h3>
            <p class="card-value">{{ (resume.totalVentes > 0 ? (resume.benefice / resume.totalVentes * 100) : 0) | number:'0.0-1' }}%</p>
            <span class="card-subtitle">Rentabilité</span>
            <div class="card-detail">Santé financière {{ (resume.benefice > 0 ? 'Bonne' : 'À améliorer') }}</div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button [class.active]="activeTab === 'depenses'" (click)="setTab('depenses')" class="tab-btn">
          <i class="fas fa-arrow-down"></i> Dépenses
        </button>
        <button [class.active]="activeTab === 'ventes'" (click)="setTab('ventes')" class="tab-btn">
          <i class="fas fa-arrow-up"></i> Ventes
        </button>
      </div>

      <!-- Dépenses Tab -->
      <div class="tab-content" *ngIf="activeTab === 'depenses'">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Libellé</th>
                <th>Type</th>
                <th>Montant (FCFA)</th>
                <th>Fournisseur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let depense of getDepensesPaginees()">
                <td>{{ formatDate(depense.dateDepense) }}</td>
                <td>
                  <div class="libelle">{{ depense.libelle }}</div>
                  <div class="description" *ngIf="depense.description">{{ depense.description }}</div>
                </td>
                <td><span class="type-badge" [class]="'type-' + depense.typeDepense.toLowerCase()">{{ getTypeLabel(depense.typeDepense) }}</span></td>
                <td><span class="montant">{{ depense.montant | number }}</span></td>
                <td>{{ depense.fournisseur?.nom || '-' }}</td>
                <td>
                  <button class="btn-icon btn-edit" (click)="editerDepense(depense)" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon btn-delete" (click)="supprimerDepense(depense.idDepense!)" title="Supprimer">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="depenses.length === 0">
                <td colspan="6" class="empty-state">
                  <div class="empty-icon"><i class="fas fa-arrow-down"></i></div>
                  <p>Aucune dépense enregistrée</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="pagination" *ngIf="depenses.length > pageSize">
          <button [disabled]="currentPageDepenses === 1" (click)="previousPageDepenses()" class="pagination-btn">
            <i class="fas fa-chevron-left"></i> Précédent
          </button>
          <div class="pagination-info">
            Page {{ currentPageDepenses }} sur {{ getTotalPagesDepenses() }}
          </div>
          <button [disabled]="currentPageDepenses === getTotalPagesDepenses()" (click)="nextPageDepenses()" class="pagination-btn">
            Suivant <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Ventes Tab -->
      <div class="tab-content" *ngIf="activeTab === 'ventes'">
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Client</th>
                <th>Montant (FCFA)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let vente of getVentesPaginees()">
                <td><span class="id-badge">#{{ vente.idCommande }}</span></td>
                <td>{{ formatDate(vente.dateCommande) }}</td>
                <td>{{ vente.client.nom }} {{ vente.client.prenom || '' }}</td>
                <td><span class="montant">{{ vente.montant | number }}</span></td>
              </tr>
              <tr *ngIf="ventes.length === 0">
                <td colspan="4" class="empty-state">
                  <div class="empty-icon"><i class="fas fa-arrow-up"></i></div>
                  <p>Aucune vente enregistrée</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="pagination" *ngIf="ventes.length > pageSize">
          <button [disabled]="currentPageVentes === 1" (click)="previousPageVentes()" class="pagination-btn">
            <i class="fas fa-chevron-left"></i> Précédent
          </button>
          <div class="pagination-info">
            Page {{ currentPageVentes }} sur {{ getTotalPagesVentes() }}
          </div>
          <button [disabled]="currentPageVentes === getTotalPagesVentes()" (click)="nextPageVentes()" class="pagination-btn">
            Suivant <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Modal Dépense -->
      <div class="modal" [class.open]="modalDepenseOpen" (click)="fermerModalDepense()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <i class="fas" [class.fa-edit]="depenseEdit" [class.fa-plus]="!depenseEdit"></i>
              {{ depenseEdit ? 'Modifier' : 'Ajouter' }} une dépense
            </h2>
            <button class="close-btn" (click)="fermerModalDepense()"><i class="fas fa-times"></i></button>
          </div>
          <form (ngSubmit)="sauvegarderDepense()" class="modal-form">
            <div class="form-group">
              <label>Libellé *</label>
              <input type="text" [(ngModel)]="formData.libelle" name="libelle" required placeholder="Ex: Achat de riz" class="form-input" />
            </div>
            <div class="form-group">
              <label>Montant (FCFA) *</label>
              <input type="number" [(ngModel)]="formData.montant" name="montant" required step="0.01" min="0" placeholder="0" class="form-input" />
            </div>
            <div class="form-group">
              <label>Type *</label>
              <select [(ngModel)]="formData.typeDepense" name="typeDepense" required class="form-input">
                <option value="ACHAT_PRODUITS">Achat de produits</option>
                <option value="SALAIRES">Salaires</option>
                <option value="LOYER">Loyer</option>
                <option value="UTILITAIRES">Utilitaires</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="MARKETING">Marketing</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fournisseur</label>
              <select [(ngModel)]="formData.fournisseurId" name="fournisseurId" class="form-input">
                <option value="">Aucun fournisseur</option>
                <option *ngFor="let fournisseur of fournisseurs" [value]="fournisseur.idFournisseur">
                  {{ fournisseur.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="formData.description" name="description" rows="3" placeholder="Description optionnelle..." class="form-textarea"></textarea>
            </div>
            <div class="form-group">
              <label>Date *</label>
              <input type="datetime-local" [(ngModel)]="formData.dateDepense" name="dateDepense" required class="form-input" />
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="fermerModalDepense()">Annuler</button>
              <button type="submit" class="btn-primary" [disabled]="loading">
                {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <app-confirm-dialog
        [isOpen]="confirmSupprimerOpen"
        title="Supprimer la dépense"
        message="Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible."
        confirmText="Oui, supprimer"
        cancelText="Annuler"
        type="warning"
        (confirmed)="confirmerSuppression()"
        (cancelled)="confirmSupprimerOpen = false">
      </app-confirm-dialog>
    </div>
  `,
  styles: [`
    .gestion-finances {
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
    .resume-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .resume-card {
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      border-radius: 16px;
      padding: 2rem;
      border: 2px solid rgba(255, 107, 53, 0.15);
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .resume-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
      transition: left 0.5s ease;
    }
    .resume-card:hover {
      border-color: rgba(255, 107, 53, 0.4);
      box-shadow: 0 8px 30px rgba(255, 107, 53, 0.15);
      transform: translateY(-5px);
    }
    .resume-card:hover::before {
      left: 100%;
    }
    .resume-card.ventes .card-icon {
      background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
    }
    .resume-card.depenses .card-icon {
      background: linear-gradient(135deg, #F44336 0%, #d32f2f 100%);
      box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
    }
    .resume-card.benefice .card-icon {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
    }
    .resume-card.benefice.negatif .card-icon {
      background: linear-gradient(135deg, #F44336 0%, #d32f2f 100%);
      box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
    }
    .resume-card.taux .card-icon {
      background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
      box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
    }
    .card-icon {
      width: 70px;
      height: 70px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      color: white;
      flex-shrink: 0;
    }
    .card-content {
      flex: 1;
    }
    .card-content h3 {
      margin: 0 0 0.7rem;
      font-size: 0.95rem;
      color: #999;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .card-value {
      margin: 0 0 0.3rem;
      font-size: 2rem;
      font-weight: 700;
      color: white;
      line-height: 1;
    }
    .card-subtitle {
      font-size: 0.8rem;
      color: #666;
      display: block;
      margin-bottom: 0.5rem;
    }
    .card-detail {
      font-size: 0.85rem;
      color: #888;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 107, 53, 0.1);
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
    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 107, 53, 0.2);
    }
    .tab-btn {
      padding: 1rem 2rem;
      background: transparent;
      border: none;
      color: #999;
      cursor: pointer;
      font-weight: 600;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .tab-btn:hover {
      color: #FF6B35;
    }
    .tab-btn.active {
      color: #FF6B35;
      border-bottom-color: #FF6B35;
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
      font-size: 0.9rem;
    }
    tbody tr {
      border-bottom: 1px solid rgba(255, 107, 53, 0.1);
      transition: background 0.2s ease;
    }
    tbody tr:hover {
      background: rgba(255, 107, 53, 0.05);
    }
    td {
      padding: 1.25rem 1.5rem;
      color: white;
      font-size: 0.95rem;
    }
    .libelle {
      font-weight: 600;
      color: white;
    }
    .description {
      font-size: 0.85rem;
      color: #999;
      margin-top: 0.25rem;
    }
    .type-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-block;
    }
    .montant {
      font-weight: 700;
      color: #FF6B35;
      font-size: 1.1rem;
    }
    .actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-size: 0.9rem;
    }
    .btn-edit {
      background: rgba(33, 150, 243, 0.2);
      color: #2196F3;
    }
    .btn-edit:hover {
      background: rgba(33, 150, 243, 0.3);
    }
    .btn-delete {
      background: rgba(244, 67, 54, 0.2);
      color: #F44336;
    }
    .btn-delete:hover {
      background: rgba(244, 67, 54, 0.3);
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #999;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: rgba(255, 107, 53, 0.3);
    }
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      overflow-y: auto;
    }
    .modal.open {
      opacity: 1;
      visibility: visible;
    }
    .modal-content {
      background: linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%);
      border-radius: 16px;
      padding: 2.5rem;
      width: 90%;
      max-width: 600px;
      margin: 2rem auto;
      color: white;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 107, 53, 0.2);
      max-height: 90vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .modal-content::-webkit-scrollbar {
      width: 8px;
    }
    .modal-content::-webkit-scrollbar-track {
      background: #1A1A1A;
    }
    .modal-content::-webkit-scrollbar-thumb {
      background: #FF6B35;
      border-radius: 10px;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255, 107, 53, 0.2);
    }
    .modal-header h2 {
      margin: 0;
      font-size: 1.8rem;
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .close-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 50%;
      color: #CCC;
      width: 40px;
      height: 40px;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #CCC;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .form-input, .form-textarea {
      width: 100%;
      padding: 0.9rem 1.2rem;
      background: #1A1A1A;
      border: 1px solid rgba(255, 107, 53, 0.3);
      border-radius: 10px;
      color: white;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    .form-input:focus, .form-textarea:focus {
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
      border-top: 1px solid rgba(255, 107, 53, 0.2);
    }
    .btn-secondary {
      padding: 0.9rem 1.8rem;
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    @media (max-width: 1024px) {
      .resume-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class GestionFinancesComponent implements OnInit {
  depenses: Depense[] = [];
  ventes: Vente[] = [];
  resume: ResumeFinancier | null = null;
  fournisseurs: any[] = [];
  activeTab: 'depenses' | 'ventes' = 'depenses';
  modalDepenseOpen = false;
  depenseEdit: Depense | null = null;
  loading = false;
  confirmSupprimerOpen = false;
  depenseASupprimer: number | null = null;
  currentPageDepenses = 1;
  currentPageVentes = 1;
  pageSize = 10;

  formData = {
    libelle: '',
    montant: 0,
    description: '',
    typeDepense: 'ACHAT_PRODUITS' as Depense['typeDepense'],
    dateDepense: new Date().toISOString().slice(0, 16),
    fournisseurId: null as number | null
  };

  constructor(
    private financeService: FinanceService,
    private fournisseurService: FournisseurService,
    private notificationService: NotificationService,
    private modalHelper: ModalHelperService
  ) {}

  ngOnInit() {
    this.chargerDonnees();
  }

  chargerDonnees() {
    this.chargerDepenses();
    this.chargerVentes();
    this.chargerResume();
    this.chargerFournisseurs();
  }

  chargerDepenses() {
    this.financeService.getAllDepenses().subscribe({
      next: (data) => {
        this.depenses = data || [];
      },
      error: (err) => {
        console.error('Erreur chargement dépenses:', err);
        this.notificationService.error('Erreur lors du chargement des dépenses');
      }
    });
  }

  chargerVentes() {
    this.financeService.getAllVentes().subscribe({
      next: (data: any) => {
        // Transformer les commandes en ventes
        this.ventes = (data || []).map((commande: any) => ({
          idCommande: commande.idCommande,
          dateCommande: commande.dateCommande,
          montant: commande.lignesCommande?.reduce((sum: number, ligne: any) => 
            sum + (ligne.prixUnitaire * ligne.quantite), 0) || 0,
          client: commande.client || { nom: 'N/A' }
        }));
      },
      error: (err) => {
        console.error('Erreur chargement ventes:', err);
        this.notificationService.error('Erreur lors du chargement des ventes');
      }
    });
  }

  chargerResume() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1).toISOString();
    const end = new Date(now.getFullYear() + 1, 0, 1).toISOString();
    
    this.financeService.getResumeFinancier(start, end).subscribe({
      next: (data) => {
        this.resume = data;
      },
      error: (err) => {
        console.error('Erreur chargement résumé:', err);
      }
    });
  }

  chargerFournisseurs() {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data || [];
      },
      error: (err) => {
        console.error('Erreur chargement fournisseurs:', err);
      }
    });
  }

  setTab(tab: 'depenses' | 'ventes') {
    this.activeTab = tab;
  }

  ouvrirModalDepense() {
    this.depenseEdit = null;
    this.formData = {
      libelle: '',
      montant: 0,
      description: '',
      typeDepense: 'ACHAT_PRODUITS',
      dateDepense: new Date().toISOString().slice(0, 16),
      fournisseurId: null
    };
    this.modalDepenseOpen = true;
    this.modalHelper.openModal();
  }

  editerDepense(depense: Depense) {
    this.depenseEdit = depense;
    this.formData = {
      libelle: depense.libelle,
      montant: depense.montant,
      description: depense.description || '',
      typeDepense: depense.typeDepense,
      dateDepense: new Date(depense.dateDepense).toISOString().slice(0, 16),
      fournisseurId: depense.fournisseur?.idFournisseur || null
    };
    this.modalDepenseOpen = true;
    this.modalHelper.openModal();
  }

  fermerModalDepense() {
    this.modalDepenseOpen = false;
    this.depenseEdit = null;
    this.modalHelper.closeModal();
  }

  sauvegarderDepense() {
    if (!this.formData.libelle || this.formData.montant <= 0) {
      this.notificationService.warning('Veuillez remplir tous les champs requis');
      return;
    }

    this.loading = true;
    const depense: Depense = {
      libelle: this.formData.libelle,
      montant: this.formData.montant,
      description: this.formData.description || undefined,
      typeDepense: this.formData.typeDepense,
      dateDepense: new Date(this.formData.dateDepense).toISOString(),
      fournisseur: this.formData.fournisseurId ? { idFournisseur: this.formData.fournisseurId } as any : undefined
    };

    const request = this.depenseEdit
      ? this.financeService.updateDepense(this.depenseEdit.idDepense!, depense)
      : this.financeService.createDepense(depense);

    request.subscribe({
      next: () => {
        this.notificationService.success(this.depenseEdit ? 'Dépense modifiée avec succès !' : 'Dépense ajoutée avec succès !');
        this.chargerDonnees();
        this.fermerModalDepense();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.loading = false;
        this.notificationService.error('Erreur lors de l\'enregistrement de la dépense');
      }
    });
  }

  supprimerDepense(id: number) {
    this.depenseASupprimer = id;
    this.confirmSupprimerOpen = true;
  }

  confirmerSuppression() {
    if (this.depenseASupprimer) {
      this.financeService.deleteDepense(this.depenseASupprimer).subscribe({
        next: () => {
          this.notificationService.success('Dépense supprimée avec succès !');
          this.chargerDonnees();
          this.confirmSupprimerOpen = false;
          this.depenseASupprimer = null;
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.notificationService.error('Erreur lors de la suppression');
          this.confirmSupprimerOpen = false;
        }
      });
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'ACHAT_PRODUITS': 'Achat produits',
      'SALAIRES': 'Salaires',
      'LOYER': 'Loyer',
      'UTILITAIRES': 'Utilitaires',
      'MAINTENANCE': 'Maintenance',
      'MARKETING': 'Marketing',
      'AUTRE': 'Autre'
    };
    return labels[type] || type;
  }

  getDepensesPaginees() {
    const start = (this.currentPageDepenses - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.depenses.slice(start, end);
  }

  getVentesPaginees() {
    const start = (this.currentPageVentes - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.ventes.slice(start, end);
  }

  getTotalPagesDepenses() {
    return Math.ceil(this.depenses.length / this.pageSize);
  }

  getTotalPagesVentes() {
    return Math.ceil(this.ventes.length / this.pageSize);
  }

  nextPageDepenses() {
    if (this.currentPageDepenses < this.getTotalPagesDepenses()) {
      this.currentPageDepenses++;
    }
  }

  previousPageDepenses() {
    if (this.currentPageDepenses > 1) {
      this.currentPageDepenses--;
    }
  }

  nextPageVentes() {
    if (this.currentPageVentes < this.getTotalPagesVentes()) {
      this.currentPageVentes++;
    }
  }

  previousPageVentes() {
    if (this.currentPageVentes > 1) {
      this.currentPageVentes--;
    }
  }
}

