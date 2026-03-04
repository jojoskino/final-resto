import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommandeService, CommandeResponse } from '../../services/commande.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="historique-container">
      <div class="page-header">
        <h1><i class="fas fa-history"></i> Mes Commandes</h1>
        <p class="subtitle">Consultez l'historique de toutes vos commandes</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement de vos commandes...</p>
      </div>

      <div *ngIf="!loading && commandes.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-shopping-bag"></i>
        </div>
        <h2>Aucune commande</h2>
        <p>Vous n'avez pas encore passé de commande.</p>
        <a routerLink="/menu" class="btn-primary">
          <i class="fas fa-utensils"></i> Voir le menu
        </a>
      </div>

      <div *ngIf="!loading && commandes.length > 0" class="commandes-list">
        <div *ngFor="let commande of commandes" class="commande-card">
          <div class="commande-header">
            <div class="commande-info">
              <h3>
                <i class="fas fa-receipt"></i>
                Commande #{{ commande.idCommande }}
              </h3>
              <p class="commande-date">
                <i class="fas fa-calendar"></i>
                {{ formatDate(commande.dateCommande) }}
              </p>
            </div>
            <div class="commande-total">
              <span class="total-label">Total</span>
              <span class="total-value">{{ calculerTotal(commande) | number }} FCFA</span>
            </div>
          </div>

          <div class="commande-details">
            <h4><i class="fas fa-list"></i> Détails de la commande</h4>
            <div class="lignes-commande">
              <div *ngFor="let ligne of commande.lignesCommande" class="ligne-item">
                <div class="ligne-info">
                  <span class="plat-nom">{{ ligne.plat.nom || 'Plat' }}</span>
                  <span class="plat-quantite">x{{ ligne.quantite }}</span>
                </div>
                <div class="ligne-prix">
                  {{ (ligne.prixUnitaire * ligne.quantite) | number }} FCFA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .historique-container {
      min-height: 80vh;
      padding: 3rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      color: white;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .page-header h1 i {
      color: #FFA500;
    }

    .subtitle {
      color: #999;
      font-size: 1.1rem;
      margin: 0;
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #999;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 165, 0, 0.2);
      border-top-color: #FFA500;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #999;
    }

    .empty-icon {
      font-size: 5rem;
      color: rgba(255, 165, 0, 0.3);
      margin-bottom: 1.5rem;
    }

    .empty-state h2 {
      color: white;
      font-size: 1.8rem;
      margin: 0 0 1rem;
    }

    .empty-state p {
      font-size: 1.1rem;
      margin: 0 0 2rem;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.25);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 18px rgba(255, 165, 0, 0.3);
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
    }

    .commandes-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .commande-card {
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      border-radius: 16px;
      border: 1px solid rgba(255, 165, 0, 0.15);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .commande-card:hover {
      border-color: rgba(255, 165, 0, 0.25);
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.1);
      transform: translateY(-2px);
    }

    .commande-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid rgba(255, 165, 0, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(255, 165, 0, 0.08) 0%, rgba(255, 179, 71, 0.05) 100%);
    }

    .commande-info h3 {
      margin: 0 0 0.5rem;
      font-size: 1.3rem;
      color: white;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .commande-info h3 i {
      color: #FFA500;
    }

    .commande-date {
      margin: 0;
      color: #999;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .commande-date i {
      color: #FFA500;
    }

    .commande-total {
      text-align: right;
    }

    .total-label {
      display: block;
      font-size: 0.85rem;
      color: #999;
      margin-bottom: 0.25rem;
    }

    .total-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      color: #FFA500;
    }

    .commande-details {
      padding: 1.5rem 2rem;
    }

    .commande-details h4 {
      margin: 0 0 1rem;
      font-size: 1.1rem;
      color: white;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .commande-details h4 i {
      color: #FFA500;
    }

    .lignes-commande {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .ligne-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 165, 0, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(255, 165, 0, 0.1);
    }

    .ligne-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .plat-nom {
      font-weight: 600;
      color: white;
      font-size: 1rem;
    }

    .plat-quantite {
      color: #999;
      font-size: 0.9rem;
    }

    .ligne-prix {
      font-weight: 700;
      color: #FFA500;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .historique-container {
        padding: 2rem 1rem;
      }

      .page-header h1 {
        font-size: 2rem;
      }

      .commande-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .commande-total {
        text-align: left;
        width: 100%;
      }
    }
  `]
})
export class HistoriqueComponent implements OnInit, OnDestroy {
  commandes: CommandeResponse[] = [];
  loading = true;
  private authSubscription?: Subscription;

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Vérifier que l'utilisateur est connecté et est un client
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.role === 'CLIENT') {
      this.chargerCommandes(currentUser.id);
    } else {
      // Si pas connecté ou pas client, le guard devrait rediriger
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  chargerCommandes(utilisateurId: number) {
    this.loading = true;
    this.commandeService.getCommandesByUtilisateurId(utilisateurId).subscribe({
      next: (commandes) => {
        // Trier par date décroissante (plus récentes en premier)
        this.commandes = commandes.sort((a, b) => {
          const dateA = new Date(a.dateCommande || '').getTime();
          const dateB = new Date(b.dateCommande || '').getTime();
          return dateB - dateA;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commandes:', err);
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return 'Date inconnue';
    try {
      const d = new Date(date);
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return date;
    }
  }

  calculerTotal(commande: CommandeResponse): number {
    if (!commande.lignesCommande) return 0;
    return commande.lignesCommande.reduce((total, ligne) => {
      return total + (ligne.prixUnitaire * ligne.quantite);
    }, 0);
  }
}

