import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  template: `
    <header class="header">
      <nav class="navbar">
        <div class="container">
          <div class="nav-brand">
            <a routerLink="/" class="logo">Le RadResto</a>
          </div>
          <ul class="nav-menu">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Accueil</a></li>
            <li><a routerLink="/menu" routerLinkActive="active">Menu</a></li>
            <li><a routerLink="/galerie" routerLinkActive="active">Galerie</a></li>
            <li><a routerLink="/contact" routerLinkActive="active">Contact</a></li>

          </ul>
          <div class="header-right">
            <a routerLink="/reservation" class="btn-reserver">
              <i class="fas fa-calendar-check"></i> Réserver
            </a>
            <div class="auth-section">
              <button *ngIf="!currentUser" class="btn-login" (click)="ouvrirLogin()">
                <i class="fas fa-lock"></i> Connexion
              </button>
              <div *ngIf="currentUser" class="user-menu" (click)="toggleUserMenu(); $event.stopPropagation()">
                <div class="user-info">
                  <span class="user-name">{{ currentUser.nom || currentUser.username }}</span>
                  <span class="user-role">{{ getRoleLabel(currentUser.role) }}</span>
                </div>
                <div class="user-dropdown" [class.open]="userMenuOpen" (click)="$event.stopPropagation()">
                  <a routerLink="/admin" *ngIf="isAdmin() || hasRole('GESTIONNAIRE') || hasRole('SERVEUR')" class="dropdown-item" (click)="fermerUserMenu()">
                    <i class="fas fa-chart-line"></i> Administration
                  </a>
                  <a routerLink="/historique" *ngIf="hasRole('CLIENT')" class="dropdown-item" (click)="fermerUserMenu()">
                    <i class="fas fa-history"></i> Mes Commandes
                  </a>
                  <button (click)="deconnexion()" class="dropdown-item">
                    <i class="fas fa-sign-out-alt"></i>Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <app-confirm-dialog
      [isOpen]="confirmDeconnexionOpen"
      title="Déconnexion"
      message="Êtes-vous sûr de vouloir vous déconnecter ?"
      confirmText="Oui, se déconnecter"
      cancelText="Annuler"
      type="info"
      (confirmed)="confirmerDeconnexion()"
      (cancelled)="confirmDeconnexionOpen = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .header {
      background: #1A1A1A;
      color: white;
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(255, 165, 0, 0.1);
    }
    .navbar {
      padding: 1.5rem 0;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 600;
      text-decoration: none;
      color: #FFA500;
      transition: opacity 0.3s;
    }
    .logo:hover {
      opacity: 0.8;
    }
    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2.5rem;
      margin: 0;
      padding: 0;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    .nav-menu a {
      color: white;
      text-decoration: none;
      font-weight: 400;
      font-size: 1rem;
      transition: color 0.2s ease;
      position: relative;
      padding-bottom: 0.5rem;
    }
    .nav-menu a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: #FFA500;
      transition: width 0.2s ease;
    }
    .nav-menu a:hover {
      color: #FFA500;
    }
    .nav-menu a:hover::after,
    .nav-menu a.active::after {
      width: 100%;
    }
    .nav-menu a.active {
      color: #FFA500;
    }
    .nav-menu a.active {
      color: #FF6B35;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .btn-reserver {
      padding: 0.7rem 1.5rem;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
    .btn-reserver:hover {
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
    }
    .auth-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .btn-login {
      padding: 0.7rem 1.5rem;
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 165, 0, 0.4);
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-login:hover {
      background: rgba(255, 165, 0, 0.1);
      border-color: #FFA500;
    }
    .user-menu {
      position: relative;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: background 0.2s ease;
    }
    .user-menu:hover {
      background: rgba(255, 165, 0, 0.1);
    }
    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .user-name {
      font-weight: 600;
      color: white;
      font-size: 0.9rem;
    }
    .user-role {
      font-size: 0.75rem;
      color: #FFA500;
    }
    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: #2A2A2A;
      border-radius: 12px;
      min-width: 200px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 165, 0, 0.2);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.2s ease;
      z-index: 1000;
    }
    .user-dropdown.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 1rem 1.5rem;
      color: white;
      text-decoration: none;
      border: none;
      background: transparent;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s ease;
      font-size: 0.95rem;
    }
    .dropdown-item:hover {
      background: rgba(255, 165, 0, 0.1);
    }
    .dropdown-item:first-child {
      border-radius: 12px 12px 0 0;
    }
    .dropdown-item:last-child {
      border-radius: 0 0 12px 12px;
    }
    @media (max-width: 1024px) {
      .nav-menu {
        position: static;
        transform: none;
        gap: 1.5rem;
      }
      .container {
        flex-wrap: wrap;
        justify-content: space-between;
      }
    }
    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }
      .container {
        padding: 0 1.5rem;
      }
      .user-info {
        display: none;
      }
      .user-menu {
        padding: 0.5rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userMenuOpen = false;
  confirmDeconnexionOpen = false;
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.userMenuOpen = false;
    }
  }

  ouvrirLogin(): void {
    // Émettre un événement pour ouvrir le modal de connexion
    const event = new CustomEvent('ouvrirLogin');
    window.dispatchEvent(event);
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  fermerUserMenu(): void {
    this.userMenuOpen = false;
  }

  deconnexion(): void {
    this.confirmDeconnexionOpen = true;
  }

  confirmerDeconnexion(): void {
    this.authService.logout();
    this.fermerUserMenu();
    this.confirmDeconnexionOpen = false;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ADMIN': 'Administrateur',
      'GESTIONNAIRE': 'Gestionnaire',
      'SERVEUR': 'Serveur',
      'CLIENT': 'Client'
    };
    return labels[role] || role;
  }
}

