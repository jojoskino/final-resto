import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  template: `
    <div class="admin-container">
      <!-- Overlay for mobile -->
      <div class="overlay" [class.active]="sidebarOpen" (click)="sidebarOpen = false"></div>

      <!-- Sidebar -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed" [class.open]="sidebarOpen">
        <div class="sidebar-header">
          <div class="logo-section">
            <div class="logo-icon"><i class="fas fa-utensils"></i></div>
            <div class="logo-text" *ngIf="!sidebarCollapsed">
              <h2>RadResto</h2>
              <p>Administration</p>
            </div>
          </div>
          <!-- <button class="toggle-sidebar" (click)="toggleSidebar()" *ngIf="!sidebarCollapsed">
            <i class="fas fa-bars"></i>
          </button> -->
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <i class="fas fa-chart-line nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Tableau de bord</span>
          </a>
          <a routerLink="/admin/plats" routerLinkActive="active" class="nav-item" *ngIf="canAccess('plats')">
            <i class="fas fa-utensils nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Plats</span>
          </a>
          <a routerLink="/admin/commandes" routerLinkActive="active" class="nav-item" *ngIf="canAccess('commandes')">
            <i class="fas fa-shopping-bag nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Commandes</span>
          </a>
          <a routerLink="/admin/stock" routerLinkActive="active" class="nav-item" *ngIf="canAccess('stock')">
            <i class="fas fa-boxes nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Stock</span>
          </a>
          <a routerLink="/admin/clients" routerLinkActive="active" class="nav-item" *ngIf="canAccess('clients')">
            <i class="fas fa-users nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Clients</span>
          </a>
          <a routerLink="/admin/reservations" routerLinkActive="active" class="nav-item" *ngIf="canAccess('reservations')">
            <i class="fas fa-calendar-alt nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Réservations</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active" class="nav-item" *ngIf="canAccess('categories')">
            <i class="fas fa-tags nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Catégories</span>
          </a>
          <a routerLink="/admin/fournisseurs" routerLinkActive="active" class="nav-item" *ngIf="canAccess('fournisseurs')">
            <i class="fas fa-truck nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Fournisseurs</span>
          </a>
          <a routerLink="/admin/finances" routerLinkActive="active" class="nav-item" *ngIf="canAccess('finances')">
            <i class="fas fa-chart-pie nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Finances</span>
          </a>
          <a routerLink="/admin/utilisateurs" routerLinkActive="active" class="nav-item" *ngIf="canAccess('utilisateurs')">
            <i class="fas fa-users-cog nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Utilisateurs</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <a routerLink="/" class="back-link">
            <i class="fas fa-arrow-left nav-icon"></i>
            <span class="nav-text" *ngIf="!sidebarCollapsed">Retour au site</span>
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="main-wrapper">
        <!-- Header -->
        <header class="admin-header">
          <div class="header-left">
            <button class="menu-toggle" (click)="toggleSidebar()">
              <i class="fas fa-bars"></i>
            </button>
            <h1 class="page-title">{{ pageTitle }}</h1>
          </div>
          <div class="header-right">
            <div class="user-info" *ngIf="currentUser">
              <div class="user-avatar">{{ getInitials(currentUser) }}</div>
              <div class="user-details">
                <span class="user-name">{{ currentUser.nom || currentUser.username }}</span>
                <span class="user-role">{{ getRoleLabel(currentUser.role) }}</span>
              </div>
              <button class="btn-logout" (click)="demanderDeconnexion()" title="Déconnexion">
                <i class="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>

        <!-- Content Area -->
        <main class="admin-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <!-- Dialog de confirmation de déconnexion -->
    <app-confirm-dialog
      [isOpen]="confirmDeconnexionOpen"
      title="Déconnexion"
      message="Êtes-vous sûr de vouloir vous déconnecter ?"
      confirmText="Oui, se déconnecter"
      cancelText="Annuler"
      type="info"
      (confirmed)="deconnexion()"
      (cancelled)="confirmDeconnexionOpen = false">
    </app-confirm-dialog>
  `,
  styles: [`
    .admin-container {
      display: flex;
      min-height: 100vh;
      background: #0F0F0F;
    }

    /* Sidebar */
    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #1A1A1A 0%, #151515 100%);
      border-right: 1px solid rgba(255, 107, 53, 0.15);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      overflow-y: auto;
      transition: width 0.3s ease;
      z-index: 1000;
    }
    .sidebar.collapsed {
      width: 80px;
    }
    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 107, 53, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logo-icon {
      font-size: 1.5rem;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 107, 53, 0.2);
      border-radius: 12px;
      color: #FF6B35;
    }
    .logo-text h2 {
      margin: 0;
      color: #FF6B35;
      font-size: 1.3rem;
      font-weight: 700;
    }
    .logo-text p {
      margin: 0;
      color: #999;
      font-size: 0.75rem;
    }
    .toggle-sidebar {
      background: transparent;
      border: none;
      color: #999;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    .toggle-sidebar:hover {
      background: rgba(255, 107, 53, 0.1);
      color: #FF6B35;
    }
    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 0;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      color: #CCC;
      text-decoration: none;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
      margin: 0.25rem 0;
    }
    .nav-item:hover {
      background: rgba(255, 107, 53, 0.1);
      color: white;
      border-left-color: rgba(255, 107, 53, 0.5);
    }
    .nav-item.active {
      background: rgba(255, 107, 53, 0.15);
      color: #FF6B35;
      border-left-color: #FF6B35;
      font-weight: 600;
    }
    .nav-icon {
      font-size: 1.1rem;
      width: 24px;
      text-align: center;
    }
    .nav-text {
      flex: 1;
      font-size: 0.95rem;
    }
    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 107, 53, 0.15);
    }
    .back-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #999;
      text-decoration: none;
      font-size: 0.9rem;
      padding: 0.75rem;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    .back-link:hover {
      background: rgba(255, 107, 53, 0.1);
      color: #FF6B35;
    }

    /* Main Wrapper */
    .main-wrapper {
      flex: 1;
      margin-left: 280px;
      display: flex;
      flex-direction: column;
      transition: margin-left 0.3s ease;
    }
    .sidebar.collapsed ~ .main-wrapper {
      margin-left: 80px;
    }

    /* Admin Header */
    .admin-header {
      background: #1A1A1A;
      border-bottom: 1px solid rgba(255, 107, 53, 0.15);
      padding: 1.25rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .menu-toggle {
      display: none;
      background: transparent;
      border: none;
      color: white;
      font-size: 1.3rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.2s ease;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .menu-toggle:hover {
      background: rgba(255, 107, 53, 0.1);
    }
    .page-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 107, 53, 0.1);
      border-radius: 12px;
      border: 1px solid rgba(255, 107, 53, 0.2);
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #FF6B35;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
    }
    .user-details {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-weight: 600;
      color: white;
      font-size: 0.9rem;
    }
    .user-role {
      font-size: 0.75rem;
      color: #FF6B35;
    }
    .btn-logout {
      background: transparent;
      border: none;
      color: #999;
      font-size: 1.1rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      transition: all 0.2s ease;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-logout:hover {
      background: rgba(255, 107, 53, 0.2);
      color: #FF6B35;
    }

    /* Admin Content */
    .admin-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
    .admin-content::-webkit-scrollbar {
      width: 10px;
    }
    .admin-content::-webkit-scrollbar-track {
      background: #1A1A1A;
      border-radius: 10px;
    }
    .admin-content::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
      border-radius: 10px;
    }
    .admin-content::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #FF8C42 0%, #FFA500 100%);
    }

    /* Overlay */
    .overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    .overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .overlay {
        display: block;
      }
      .sidebar {
        transform: translateX(-100%);
        width: 280px;
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .sidebar.collapsed {
        width: 280px;
      }
      .main-wrapper {
        margin-left: 0 !important;
      }
      .menu-toggle {
        display: block;
      }
      .admin-content {
        padding: 1.5rem;
      }
    }
  `]
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  sidebarOpen = false;
  currentUser: User | null = null;
  pageTitle = 'Tableau de bord';
  confirmDeconnexionOpen = false;
  private authSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Mettre à jour le titre selon la route
    this.updatePageTitle();
    this.routerSubscription = this.router.events.subscribe(() => {
      this.updatePageTitle();
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  updatePageTitle() {
    const url = this.router.url;
    const titles: { [key: string]: string } = {
      '/admin/dashboard': 'Tableau de bord',
      '/admin/plats': 'Gestion des Plats',
      '/admin/commandes': 'Gestion des Commandes',
      '/admin/stock': 'Gestion du Stock',
      '/admin/clients': 'Gestion des Clients',
      '/admin/reservations': 'Gestion des Réservations',
            '/admin/categories': 'Gestion des Catégories',
            '/admin/fournisseurs': 'Gestion des Fournisseurs',
            '/admin/finances': 'Gestion Financière',
            '/admin/utilisateurs': 'Gestion des Utilisateurs'
    };
    this.pageTitle = titles[url] || 'Administration';
  }

  toggleSidebar() {
    if (window.innerWidth <= 1024) {
      this.sidebarOpen = !this.sidebarOpen;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  demanderDeconnexion() {
    this.confirmDeconnexionOpen = true;
  }

  deconnexion() {
    this.authService.logout();
    this.confirmDeconnexionOpen = false;
  }

  getInitials(user: User): string {
    if (user.nom && user.prenom) {
      return (user.nom[0] + user.prenom[0]).toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ADMIN': 'Administrateur',
      'GESTIONNAIRE': 'Gérant',
      'SERVEUR': 'Serveur',
      'CLIENT': 'Client'
    };
    return labels[role] || role;
  }

  canAccess(feature: string): boolean {
    if (!this.currentUser) return false;

    const role = this.currentUser.role;

    // ADMIN a accès à tout
    if (role === 'ADMIN') return true;

    // GESTIONNAIRE (Gérant) a accès à presque tout sauf certaines fonctionnalités sensibles
    if (role === 'GESTIONNAIRE') {
      return ['plats', 'commandes', 'stock', 'clients', 'reservations', 'categories', 'fournisseurs', 'finances'].includes(feature);
    }

    // SERVEUR a accès limité : commandes, réservations, plats
    if (role === 'SERVEUR') {
      return ['commandes', 'reservations', 'plats'].includes(feature);
    }

    // Utilisateurs : seulement ADMIN
    //if (feature === 'utilisateurs') {
     // return role === 'ADMIN';
    //}

    return false;
  }
}
