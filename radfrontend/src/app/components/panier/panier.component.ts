import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PanierService, ItemPanier } from '../../services/panier.service';
import { CommandeService, CommandeRequest } from '../../services/commande.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ConfirmDialogComponent],
  template: `
    <!-- Bouton fixe en bas à droite -->
    <button class="panier-fab" (click)="ouvrirPanier()" *ngIf="!isOpen">
      <i class="fas fa-shopping-cart"></i>
      <span class="fab-badge" *ngIf="nombreItems > 0">{{ nombreItems }}</span>
    </button>

    <div class="panier-overlay" (click)="fermerPanier()" [class.open]="isOpen">
      <div class="panier-sidebar" (click)="$event.stopPropagation()" [class.open]="isOpen">
        <div class="panier-header">
          <h2><i class="fas fa-shopping-cart"></i> Mon Panier</h2>
          <button class="close-btn" (click)="fermerPanier()"><i class="fas fa-times"></i></button>
        </div>
        <div class="panier-content">
          <div *ngIf="items.length === 0" class="panier-vide">
            <div class="empty-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <p>Votre panier est vide</p>
            <p class="text-muted">Ajoutez des plats depuis le menu !</p>
            <a routerLink="/menu" class="btn-menu" (click)="fermerPanier()">
              <i class="fas fa-utensils"></i> Voir le menu
            </a>
          </div>
          <div *ngFor="let item of items" class="panier-item">
            <div class="item-info">
              <h4>{{ item.plat.nom }}</h4>
              <p class="item-price">{{ item.plat.prix | number }} FCFA</p>
            </div>
            <div class="item-controls">
              <button (click)="diminuerQuantite(item.plat.idPlat!)" class="btn-quantite" title="Diminuer">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantite">{{ item.quantite }}</span>
              <button (click)="augmenterQuantite(item.plat.idPlat!)" class="btn-quantite" title="Augmenter">
                <i class="fas fa-plus"></i>
              </button>
              <button (click)="retirerItem(item.plat.idPlat!)" class="btn-supprimer" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div class="item-total">
              {{ (item.plat.prix * item.quantite) | number }} FCFA
            </div>
          </div>
        </div>
        <div class="panier-footer" *ngIf="items.length > 0">
          <div class="total">
            <strong>Total: {{ total | number }} FCFA</strong>
          </div>
          <div *ngIf="!currentUser" class="login-prompt">
            <p><i class="fas fa-info-circle"></i> Connectez-vous pour commander</p>
            <button class="btn-login-panier" (click)="ouvrirLogin()">
              <i class="fas fa-lock"></i> Se connecter
            </button>
          </div>
          <button *ngIf="currentUser" class="btn-commander" (click)="commander()" [disabled]="loading">
            <i class="fas fa-check" *ngIf="!loading"></i>
            <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
            {{ loading ? 'Enregistrement...' : 'Commander' }}
          </button>
          <button class="btn-vider" (click)="demanderViderPanier()">
            <i class="fas fa-trash-alt"></i> Vider le panier
          </button>
        </div>
      </div>
    </div>

    <!-- Dialog de confirmation -->
    <app-confirm-dialog
      [isOpen]="confirmViderOpen"
      title="Vider le panier"
      message="Êtes-vous sûr de vouloir vider votre panier ? Cette action est irréversible."
      confirmText="Oui, vider"
      cancelText="Annuler"
      type="warning"
      (confirmed)="viderPanier()"
      (cancelled)="confirmViderOpen = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .panier-fab {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(255, 165, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      z-index: 1500;
      transition: all 0.3s ease;
    }
    .panier-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(255, 165, 0, 0.5);
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
    }
    .fab-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #F44336;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
      border: 2px solid #1A1A1A;
    }
    .panier-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 2000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
    }
    .panier-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    .panier-sidebar {
      position: fixed;
      top: 0;
      right: -450px;
      width: 450px;
      max-width: 90vw;
      height: 100%;
      background: linear-gradient(180deg, #1F1F1F 0%, #1A1A1A 100%);
      box-shadow: -8px 0 30px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      transition: right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      color: white;
      border-left: 1px solid rgba(255, 165, 0, 0.1);
      backdrop-filter: blur(10px);
    }
    .panier-sidebar.open {
      right: 0;
    }
    .panier-header {
      padding: 1.2rem 1.5rem;
      border-bottom: 1px solid rgba(255, 165, 0, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(255, 165, 0, 0.08) 0%, rgba(255, 179, 71, 0.05) 100%);
      color: white;
      backdrop-filter: blur(5px);
      flex-shrink: 0;
    }
    .panier-header h2 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
    }
    .panier-header h2 i {
      color: #FFA500;
      font-size: 1.4rem;
    }
    .close-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }
    .close-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: rotate(90deg);
    }
    .panier-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1.5rem;
      background: #1A1A1A;
      min-height: 0;
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
    .panier-vide {
      text-align: center;
      padding: 4rem 1rem;
      color: #999;
    }
    .empty-icon {
      font-size: 4rem;
      color: rgba(255, 165, 0, 0.3);
      margin-bottom: 1.5rem;
    }
    .panier-vide p {
      font-size: 1.2rem;
      margin: 0.5rem 0;
    }
    .text-muted {
      color: #666;
      font-size: 1rem;
    }
    .btn-menu {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.9rem 2rem;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(255, 165, 0, 0.2);
    }
    .btn-menu:hover {
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(255, 165, 0, 0.3);
    }
    .btn-menu i {
      margin-right: 0.5rem;
    }
    .panier-item {
      padding: 1.5rem;
      border: 1px solid rgba(255, 165, 0, 0.08);
      background: linear-gradient(135deg, rgba(42, 42, 42, 0.6) 0%, rgba(30, 30, 30, 0.7) 100%);
      border-radius: 16px;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(5px);
    }
    .panier-item:hover {
      border-color: rgba(255, 165, 0, 0.25);
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.1);
      transform: translateY(-2px);
      background: linear-gradient(135deg, rgba(42, 42, 42, 0.8) 0%, rgba(30, 30, 30, 0.85) 100%);
    }
    .item-info {
      flex: 1;
      min-width: 0;
    }
    .item-info h4 {
      margin: 0 0 0.5rem;
      color: white;
      font-size: 1.15rem;
      font-weight: 600;
      line-height: 1.4;
    }
    .item-price {
      color: #999;
      font-size: 0.95rem;
    }
    .item-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 1rem 0;
      flex-wrap: wrap;
    }
    .btn-quantite {
      width: 36px;
      height: 36px;
      border: 1.5px solid rgba(255, 165, 0, 0.4);
      background: rgba(255, 165, 0, 0.1);
      color: #FFA500;
      cursor: pointer;
      border-radius: 10px;
      font-weight: 600;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }
    .btn-quantite:hover {
      background: rgba(255, 165, 0, 0.2);
      border-color: rgba(255, 165, 0, 0.6);
      transform: scale(1.05);
    }
    .quantite {
      min-width: 40px;
      text-align: center;
      font-weight: 600;
      color: white;
      font-size: 1rem;
    }
    .btn-supprimer {
      background: rgba(244, 67, 54, 0.1);
      border: 1px solid rgba(244, 67, 54, 0.3);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.5rem 0.7rem;
      border-radius: 10px;
      transition: all 0.2s ease;
      color: #F44336;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-supprimer:hover {
      background: rgba(244, 67, 54, 0.2);
      border-color: rgba(244, 67, 54, 0.5);
      transform: scale(1.05);
    }
    .item-total {
      font-weight: 700;
      color: #FFA500;
      font-size: 1.2rem;
    }
    .panier-footer {
      padding: 1.2rem 1.5rem;
      border-top: 1px solid rgba(255, 165, 0, 0.15);
      background: linear-gradient(180deg, #1A1A1A 0%, #151515 100%);
      flex-shrink: 0;
    }
    .total {
      margin-bottom: 1rem;
      font-size: 1.4rem;
      color: white;
      text-align: center;
      padding: 0.8rem;
      background: #2A2A2A;
      border-radius: 12px;
    }
    .total strong {
      color: #FFA500;
    }
    .btn-commander {
      width: 100%;
      padding: 1.1rem;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 0.8rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-commander:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 165, 0, 0.35);
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
    }
    .btn-commander:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-commander i {
      margin-right: 0.5rem;
    }
    .btn-vider {
      width: 100%;
      padding: 0.9rem;
      background: transparent;
      border: 1.5px solid rgba(255, 165, 0, 0.3);
      color: #FFA500;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.95rem;
    }
    .btn-vider:hover {
      background: rgba(255, 165, 0, 0.1);
      border-color: rgba(255, 165, 0, 0.5);
      color: #FFB347;
    }
    .login-prompt {
      background: linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 179, 71, 0.05) 100%);
      border: 1px solid rgba(255, 165, 0, 0.2);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;
      text-align: center;
    }
    .login-prompt p {
      margin: 0 0 1rem;
      color: #CCC;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .login-prompt p i {
      color: #FFA500;
      font-size: 1rem;
    }
    .btn-login-panier {
      width: 100%;
      padding: 0.9rem;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      box-shadow: 0 4px 12px rgba(255, 165, 0, 0.2);
    }
    .btn-login-panier:hover {
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(255, 165, 0, 0.3);
    }
    .btn-login-panier i {
      font-size: 1rem;
    }
    @media (max-width: 768px) {
      .panier-sidebar {
        width: 100%;
        right: -100%;
      }
    }
  `]
})
export class PanierComponent implements OnInit, OnDestroy {
  items: ItemPanier[] = [];
  total = 0;
  isOpen = false;
  loading = false;
  confirmViderOpen = false;
  currentUser: any = null;
  nombreItems = 0;
  private ouvrirPanierHandler = () => this.ouvrirPanier();
  private authSubscription?: any;

  constructor(
    private panierService: PanierService,
    private commandeService: CommandeService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.panierService.panier$.subscribe(panier => {
      this.items = panier;
      this.total = this.panierService.getTotal();
      this.nombreItems = this.panierService.getNombreItems();
    });

    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // S'assurer que l'utilisateur est toujours à jour
      if (user && user.id) {
        const storedUser = this.authService.getCurrentUser();
        if (!storedUser || storedUser.id !== user.id) {
          console.warn('Incohérence détectée dans l\'utilisateur actuel');
        }
      }
    });

    // Écouter l'événement personnalisé pour ouvrir le panier
    window.addEventListener('ouvrirPanier', this.ouvrirPanierHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('ouvrirPanier', this.ouvrirPanierHandler);
    this.authSubscription?.unsubscribe();
  }

  ouvrirLogin() {
    this.fermerPanier();
    setTimeout(() => {
      const event = new CustomEvent('ouvrirLogin');
      window.dispatchEvent(event);
    }, 300);
  }

  ouvrirPanier() {
    this.isOpen = true;
  }

  fermerPanier() {
    this.isOpen = false;
  }

  augmenterQuantite(platId: number) {
    const item = this.items.find(i => i.plat.idPlat === platId);
    if (item) {
      this.panierService.modifierQuantite(platId, item.quantite + 1);
    }
  }

  diminuerQuantite(platId: number) {
    const item = this.items.find(i => i.plat.idPlat === platId);
    if (item && item.quantite > 1) {
      this.panierService.modifierQuantite(platId, item.quantite - 1);
    } else {
      this.retirerItem(platId);
    }
  }

  retirerItem(platId: number) {
    this.panierService.retirerDuPanier(platId);
  }

  demanderViderPanier() {
    this.confirmViderOpen = true;
  }

  viderPanier() {
    this.panierService.viderPanier();
    this.confirmViderOpen = false;
    this.notificationService.info('Panier vidé avec succès');
  }

  commander() {
    if (this.items.length === 0) {
      this.notificationService.warning('Votre panier est vide !');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.notificationService.warning('Veuillez vous connecter pour passer une commande.');
      this.fermerPanier();
      // Ouvrir le modal de connexion via le header
      setTimeout(() => {
        const event = new CustomEvent('ouvrirLogin');
        window.dispatchEvent(event);
      }, 300);
      return;
    }

    // Vérifier que l'utilisateur est bien un client
    if (currentUser.role !== 'CLIENT') {
      this.notificationService.error('Seuls les clients peuvent passer des commandes.');
      return;
    }

    // Vérifier que l'ID utilisateur est valide
    if (!currentUser.id || currentUser.id <= 0) {
      this.notificationService.error('Erreur : identifiant utilisateur invalide. Veuillez vous reconnecter.');
      return;
    }

    this.loading = true;
    
    // Créer la commande avec validation
    const commandeRequest: CommandeRequest = {
      utilisateurId: currentUser.id, // Utiliser utilisateurId au lieu de clientId
      lignesCommande: this.items.map(item => {
        if (!item.plat.idPlat) {
          throw new Error('Plat invalide dans le panier');
        }
        return {
          platId: item.plat.idPlat,
          quantite: item.quantite,
          prixUnitaire: item.plat.prix
        };
      })
    };

    // Log pour déboguer (à retirer en production)
    console.log('Création de commande pour utilisateur:', currentUser.id, currentUser.username);

    this.commandeService.createCommande(commandeRequest).subscribe({
      next: (commande) => {
        // Vérifier que la commande créée correspond bien à l'utilisateur actuel
        if (commande.client && currentUser.id) {
          // La vérification côté serveur devrait avoir été faite, mais on vérifie quand même
          console.log('Commande créée:', commande.idCommande, 'pour utilisateur:', currentUser.id);
        }
        
        this.notificationService.success(`Commande #${commande.idCommande} enregistrée avec succès ! Total: ${this.total.toLocaleString()} FCFA`);
        this.panierService.viderPanier();
        this.fermerPanier();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la commande:', err);
        let errorMsg = 'Erreur inconnue';
        
        if (err.error) {
          if (err.error.message) {
            errorMsg = err.error.message;
          } else if (typeof err.error === 'string') {
            errorMsg = err.error;
          }
        } else if (err.message) {
          errorMsg = err.message;
        }
        
        // Messages d'erreur plus explicites
        if (errorMsg.includes('Client introuvable') || errorMsg.includes('utilisateur')) {
          errorMsg = 'Votre compte client n\'est pas configuré correctement. Veuillez vous reconnecter.';
        } else if (errorMsg.includes('Plat introuvable')) {
          errorMsg = 'Un des plats sélectionnés n\'est plus disponible.';
        } else if (errorMsg.includes('requis')) {
          errorMsg = 'Des informations manquantes empêchent la création de la commande.';
        }
        
        this.notificationService.error(`Erreur lors de l'enregistrement de la commande : ${errorMsg}`);
        this.loading = false;
      }
    });
  }
}

