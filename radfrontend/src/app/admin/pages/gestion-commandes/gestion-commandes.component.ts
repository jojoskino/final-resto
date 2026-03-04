import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommandeService } from '../../../services/commande.service';
import { PlatService } from '../../../services/plat.service';
import { ClientService } from '../../../services/client.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-gestion-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gestion-commandes">
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fas fa-shopping-bag"></i> Gestion des Commandes</h1>
          <p class="subtitle">Suivez et gérez toutes les commandes</p>
        </div>
        <button class="btn-primary" (click)="ouvrirModalCommande()">
          <i class="fas fa-plus"></i> Ajouter une commande
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

      <div *ngIf="loading && commandes.length === 0" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des commandes...</p>
      </div>

      <div class="table-wrapper" *ngIf="!loading || commandes.length > 0">
        <div *ngIf="loading && commandes.length > 0" class="loading-overlay">
          <div class="spinner-small"></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant (FCFA)</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let commande of getCommandesPaginees()">
              <td><span class="id-badge">#{{ commande.idCommande }}</span></td>
              <td>
                <div class="client-info">
                  <strong>{{ commande.client?.nom || 'N/A' }}</strong>
                  <span class="client-detail">{{ commande.client?.prenom || '' }}</span>
                </div>
              </td>
              <td>{{ formatDate(commande.dateCommande) }}</td>
              <td><span class="prix">{{ calculerMontant(commande) | number }}</span></td>
              <td>
                <select 
                  class="statut-select" 
                  [value]="commande.statut || 'EN_ATTENTE'"
                  (change)="changerStatut(commande, $event)"
                  [disabled]="loading">
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="EN_PREPARATION">En préparation</option>
                  <option value="PRETE">Prête</option>
                  <option value="EN_LIVRAISON">En livraison</option>
                  <option value="LIVREE">Livrée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </td>
              <td>
                <button class="btn-icon btn-view" (click)="voirDetails(commande)" title="Voir détails">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="!loading && commandesFiltrees.length === 0">
              <td colspan="6" class="empty-state">
                <div class="empty-icon"><i class="fas fa-shopping-bag"></i></div>
                <p>Aucune commande</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="commandesFiltrees.length > pageSize">
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

      <!-- Modal pour créer une commande -->
      <div class="modal" [class.open]="modalCommandeOpen" (click)="fermerModalCommande()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2><i class="fas fa-plus"></i> Créer une commande</h2>
            <button class="close-btn" (click)="fermerModalCommande()"><i class="fas fa-times"></i></button>
          </div>
          <form (ngSubmit)="creerCommande()" class="modal-form">
            <div class="form-group">
              <label>Client *</label>
              <select [(ngModel)]="formCommande.clientId" name="clientId" required class="form-input">
                <option value="">Sélectionner un client</option>
                <option *ngFor="let client of clients" [value]="client.idClient">
                  {{ client.nom }} {{ client.prenom || '' }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Plats *</label>
              <div class="plats-selection">
                <div *ngFor="let ligne of formCommande.lignesCommande; let i = index" class="ligne-commande">
                  <select [(ngModel)]="ligne.platId" [name]="'platId_' + i" required class="form-input">
                    <option value="">Sélectionner un plat</option>
                    <option *ngFor="let plat of plats" [value]="plat.idPlat">
                      {{ plat.nom }} - {{ plat.prix | number }} FCFA
                    </option>
                  </select>
                  <input type="number" [(ngModel)]="ligne.quantite" [name]="'quantite_' + i" required min="1" placeholder="Qté" class="form-input quantite-input">
                  <button type="button" class="btn-remove" (click)="retirerLigne(i)" *ngIf="formCommande.lignesCommande.length > 1">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                <button type="button" class="btn-add-ligne" (click)="ajouterLigne()">
                  <i class="fas fa-plus"></i> Ajouter un plat
                </button>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="fermerModalCommande()">Annuler</button>
              <button type="submit" class="btn-primary" [disabled]="loading">
                {{ loading ? 'Création...' : 'Créer la commande' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gestion-commandes {
      color: white;
    }
    .page-header {
      margin-bottom: 2rem;
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
    .client-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .client-info strong {
      color: white;
    }
    .client-detail {
      font-size: 0.85rem;
      color: #999;
    }
    .prix {
      font-weight: 700;
      color: #FF6B35;
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
    .statut-select {
      padding: 0.5rem 1rem;
      background: #1A1A1A;
      border: 1px solid rgba(255, 107, 53, 0.3);
      border-radius: 8px;
      color: white;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 150px;
    }
    .statut-select:hover:not(:disabled) {
      border-color: #FF6B35;
      background: #2A2A2A;
    }
    .statut-select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .statut-select:focus {
      outline: none;
      border-color: #FF6B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
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
    .spinner-small {
      width: 30px;
      height: 30px;
      border: 3px solid rgba(255, 107, 53, 0.2);
      border-top-color: #FF6B35;
      border-radius: 50%;
      animation: spin 1s linear infinite;
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
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
    .table-wrapper {
      position: relative;
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
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
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
      max-width: 700px;
      max-height: 90vh;
      overflow-y: auto;
      color: white;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 107, 53, 0.2);
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
    .form-input {
      width: 100%;
      padding: 1rem;
      background: #0F0F0F;
      border: 1px solid rgba(255, 165, 0, 0.3);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    .form-input:focus {
      outline: none;
      border-color: #FFA500;
      box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
    }
    .plats-selection {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .ligne-commande {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .ligne-commande .form-input {
      flex: 1;
    }
    .quantite-input {
      width: 100px;
    }
    .btn-remove {
      background: rgba(244, 67, 54, 0.2);
      border: 1px solid rgba(244, 67, 54, 0.3);
      color: #F44336;
      padding: 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-remove:hover {
      background: rgba(244, 67, 54, 0.3);
    }
    .btn-add-ligne {
      padding: 0.8rem 1.5rem;
      background: rgba(255, 165, 0, 0.1);
      border: 1px dashed rgba(255, 165, 0, 0.5);
      color: #FFA500;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-add-ligne:hover {
      background: rgba(255, 165, 0, 0.2);
      border-color: #FFA500;
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
export class GestionCommandesComponent implements OnInit {
  commandes: any[] = [];
  commandesFiltrees: any[] = [];
  filterActive = 'Toutes';
  filters = ['Toutes', 'En attente', 'En cours', 'Terminée', 'Annulée'];
  modalCommandeOpen = false;
  loading = false;
  plats: any[] = [];
  clients: any[] = [];
  currentPage = 1;
  pageSize = 10;
  formCommande = {
    clientId: null as number | null,
    lignesCommande: [{ platId: null as number | null, quantite: 1, prixUnitaire: 0 }]
  };

  constructor(
    private commandeService: CommandeService,
    private platService: PlatService,
    private clientService: ClientService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.chargerCommandes();
    this.chargerPlats();
    this.chargerClients();
  }

  chargerCommandes() {
    this.loading = true;
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => {
        this.commandes = data || [];
        this.commandesFiltrees = this.commandes;
        this.loading = false;
        console.log('Commandes chargées:', this.commandes);
      },
      error: (err) => {
        console.error('Erreur chargement commandes:', err);
        this.commandes = [];
        this.commandesFiltrees = [];
        this.loading = false;
        const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
        this.notificationService.error(`Erreur lors du chargement des commandes: ${errorMsg}`);
      }
    });
  }

  chargerPlats() {
    this.platService.getAllPlats().subscribe({
      next: (data) => {
        this.plats = data || [];
      },
      error: (err) => {
        console.error('Erreur chargement plats:', err);
      }
    });
  }

  chargerClients() {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data || [];
      },
      error: (err) => {
        console.error('Erreur chargement clients:', err);
      }
    });
  }

  ouvrirModalCommande() {
    this.formCommande = {
      clientId: null,
      lignesCommande: [{ platId: null, quantite: 1, prixUnitaire: 0 }]
    };
    this.modalCommandeOpen = true;
  }

  fermerModalCommande() {
    this.modalCommandeOpen = false;
    this.loading = false;
  }

  ajouterLigne() {
    this.formCommande.lignesCommande.push({ platId: null, quantite: 1, prixUnitaire: 0 });
  }

  retirerLigne(index: number) {
    if (this.formCommande.lignesCommande.length > 1) {
      this.formCommande.lignesCommande.splice(index, 1);
    }
  }

  creerCommande() {
    // Valider et calculer les prix
    const lignesValides = this.formCommande.lignesCommande
      .filter(l => l.platId && l.quantite > 0)
      .map(l => {
        const plat = this.plats.find(p => p.idPlat === l.platId);
        if (!plat) {
          throw new Error(`Plat introuvable pour l'ID: ${l.platId}`);
        }
        return {
          platId: l.platId!,
          quantite: l.quantite,
          prixUnitaire: plat.prix || 0
        };
      });

    if (!this.formCommande.clientId) {
      this.notificationService.warning('Veuillez sélectionner un client.');
      return;
    }

    if (lignesValides.length === 0) {
      this.notificationService.warning('Veuillez ajouter au moins un plat à la commande.');
      return;
    }

    this.loading = true;
    const commandeRequest = {
      clientId: Number(this.formCommande.clientId),
      lignesCommande: lignesValides
    };

    console.log('Création commande:', commandeRequest);

    this.commandeService.createCommande(commandeRequest).subscribe({
      next: (commande) => {
        console.log('Commande créée:', commande);
        this.notificationService.success('Commande créée avec succès !');
        this.chargerCommandes();
        this.fermerModalCommande();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur création commande:', err);
        this.loading = false;
        const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
        this.notificationService.error(`Erreur lors de la création de la commande: ${errorMsg}`);
      }
    });
  }

  setFilter(filter: string) {
    this.filterActive = filter;
    if (filter === 'Toutes') {
      this.commandesFiltrees = this.commandes;
    } else {
      this.commandesFiltrees = this.commandes;
    }
    this.currentPage = 1;
  }

  changerStatut(commande: any, event: any) {
    const nouveauStatut = event.target.value;
    if (commande.statut === nouveauStatut) {
      return;
    }
    
    this.loading = true;
    this.commandeService.updateStatut(commande.idCommande, nouveauStatut).subscribe({
      next: (commandeMiseAJour) => {
        // Mettre à jour la commande dans la liste
        const index = this.commandes.findIndex(c => c.idCommande === commande.idCommande);
        if (index !== -1) {
          this.commandes[index] = commandeMiseAJour;
          this.commandesFiltrees = [...this.commandes];
        }
        this.notificationService.success(`Statut de la commande #${commande.idCommande} mis à jour`);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
        const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
        this.notificationService.error(`Erreur lors de la mise à jour du statut: ${errorMsg}`);
        this.loading = false;
        // Restaurer l'ancien statut dans le select
        event.target.value = commande.statut || 'EN_ATTENTE';
      }
    });
  }

  voirDetails(commande: any) {
    const montant = this.calculerMontant(commande);
    let details = `Détails de la commande #${commande.idCommande}\n\n`;
    details += `Client: ${commande.client?.nom || 'N/A'} ${commande.client?.prenom || ''}\n`;
    details += `Date: ${this.formatDate(commande.dateCommande)}\n`;
    details += `Statut: ${this.getStatutLabel(commande.statut || 'EN_ATTENTE')}\n`;
    details += `Montant total: ${montant.toLocaleString()} FCFA\n\n`;
    
    if (commande.lignesCommande && commande.lignesCommande.length > 0) {
      details += `Plats commandés:\n`;
      commande.lignesCommande.forEach((ligne: any) => {
        details += `- ${ligne.plat?.nom || 'N/A'} (x${ligne.quantite}) : ${(ligne.prixUnitaire * ligne.quantite).toLocaleString()} FCFA\n`;
      });
    } else {
      details += `Aucun détail disponible`;
    }
    
    this.notificationService.info(details);
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'EN_ATTENTE': 'En attente',
      'EN_PREPARATION': 'En préparation',
      'PRETE': 'Prête',
      'EN_LIVRAISON': 'En livraison',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
    };
    return labels[statut] || statut;
  }

  calculerMontant(commande: any): number {
    if (commande.lignesCommande && commande.lignesCommande.length > 0) {
      return commande.lignesCommande.reduce((total: number, ligne: any) => {
        return total + (ligne.prixUnitaire * ligne.quantite);
      }, 0);
    }
    return 0;
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  getCommandesPaginees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.commandesFiltrees.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.commandesFiltrees.length / this.pageSize);
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
