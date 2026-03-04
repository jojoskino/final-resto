import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des données...</p>
      </div>

      <div *ngIf="!loading">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-primary">
          <div class="stat-icon"><i class="fas fa-utensils"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.plats }}</div>
            <div class="stat-label">Plats disponibles</div>
          </div>
          <div class="stat-trend">+12%</div>
        </div>
        
        <div class="stat-card stat-success">
          <div class="stat-icon"><i class="fas fa-shopping-bag"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.commandes }}</div>
            <div class="stat-label">Commandes aujourd'hui</div>
          </div>
          <div class="stat-trend">+8%</div>
        </div>
        
        <div class="stat-card stat-info">
          <div class="stat-icon"><i class="fas fa-users"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.clients }}</div>
            <div class="stat-label">Clients enregistrés</div>
          </div>
          <div class="stat-trend">+5%</div>
        </div>
        
        <div class="stat-card stat-warning">
          <div class="stat-icon"><i class="fas fa-calendar-alt"></i></div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.reservations }}</div>
            <div class="stat-label">Réservations aujourd'hui</div>
          </div>
          <div class="stat-trend">+15%</div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="dashboard-grid">
        <!-- Commandes récentes -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2><i class="fas fa-shopping-bag"></i> Commandes récentes</h2>
            <a routerLink="/admin/commandes" class="view-all">Voir tout <i class="fas fa-arrow-right"></i></a>
          </div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let commande of recentCommandes">
                  <td><span class="id-badge">#{{ commande.idCommande }}</span></td>
                  <td>
                    <div class="client-info">
                      <strong>{{ commande.client?.nom || 'N/A' }}</strong>
                      <span class="client-detail">{{ commande.client?.prenom || '' }}</span>
                    </div>
                  </td>
                  <td>{{ formatDate(commande.dateCommande) }}</td>
                  <td><span class="badge badge-success">En cours</span></td>
                </tr>
                <tr *ngIf="recentCommandes.length === 0">
                  <td colspan="4" class="empty-state">
                    <div class="empty-icon"><i class="fas fa-inbox"></i></div>
                    <p>Aucune commande récente</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Stock faible -->
        <div class="dashboard-card">
          <div class="card-header">
            <h2><i class="fas fa-exclamation-triangle"></i> Stock faible</h2>
            <a routerLink="/admin/stock" class="view-all">Gérer <i class="fas fa-arrow-right"></i></a>
          </div>
          <div class="stock-list">
            <div *ngFor="let item of stockFaible" class="stock-item">
              <div class="stock-info">
                <div class="stock-name">{{ item.produit?.nom || 'Produit' }}</div>
                <div class="stock-price">{{ item.produit?.prix | number }} FCFA</div>
              </div>
              <div class="stock-quantity">
                <span class="quantity-value" [class.low]="item.quantite < 10">{{ item.quantite }}</span>
                <span class="quantity-label">unités</span>
              </div>
            </div>
            <div *ngIf="stockFaible.length === 0" class="empty-state">
              <div class="empty-icon"><i class="fas fa-check-circle"></i></div>
              <p>Tous les stocks sont suffisants</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Actions rapides</h2>
        <div class="actions-grid">
          <a routerLink="/admin/plats" class="action-card">
            <div class="action-icon"><i class="fas fa-plus"></i></div>
            <div class="action-text">Ajouter un plat</div>
          </a>
          <a routerLink="/admin/commandes" class="action-card">
            <div class="action-icon"><i class="fas fa-shopping-bag"></i></div>
            <div class="action-text">Voir les commandes</div>
          </a>
          <a routerLink="/admin/stock" class="action-card">
            <div class="action-icon"><i class="fas fa-chart-bar"></i></div>
            <div class="action-text">Gérer le stock</div>
          </a>
          <a routerLink="/admin/reservations" class="action-card">
            <div class="action-icon"><i class="fas fa-calendar-alt"></i></div>
            <div class="action-text">Réservations</div>
          </a>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      color: white;
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

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      padding: 1.5rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 107, 53, 0.15);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: #FF6B35;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15);
      border-color: rgba(255, 107, 53, 0.3);
    }
    .stat-card.stat-primary::before { background: #FF6B35; }
    .stat-card.stat-success::before { background: #4CAF50; }
    .stat-card.stat-info::before { background: #2196F3; }
    .stat-card.stat-warning::before { background: #FF9800; }
    .stat-icon {
      font-size: 2rem;
      width: 70px;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 107, 53, 0.1);
      border-radius: 16px;
      color: #FF6B35;
    }
    .stat-content {
      flex: 1;
    }
    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    .stat-label {
      font-size: 0.9rem;
      color: #999;
    }
    .stat-trend {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 0.85rem;
      color: #4CAF50;
      font-weight: 600;
    }

    /* Dashboard Grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .dashboard-card {
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      border-radius: 16px;
      border: 1px solid rgba(255, 107, 53, 0.15);
      overflow: hidden;
    }
    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 107, 53, 0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-header h2 {
      margin: 0;
      font-size: 1.3rem;
      color: white;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .view-all {
      color: #FF6B35;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .view-all:hover {
      color: #FF8C42;
      transform: translateX(4px);
    }

    /* Table */
    .table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    thead {
      background: rgba(255, 107, 53, 0.05);
    }
    th {
      padding: 1rem 1.5rem;
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

    /* Stock List */
    .stock-list {
      padding: 1.5rem;
    }
    .stock-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      background: rgba(255, 107, 53, 0.05);
      border-radius: 12px;
      margin-bottom: 1rem;
      border: 1px solid rgba(255, 107, 53, 0.1);
      transition: all 0.2s ease;
    }
    .stock-item:hover {
      background: rgba(255, 107, 53, 0.1);
      border-color: rgba(255, 107, 53, 0.2);
    }
    .stock-item:last-child {
      margin-bottom: 0;
    }
    .stock-info {
      flex: 1;
    }
    .stock-name {
      font-weight: 600;
      color: white;
      margin-bottom: 0.25rem;
    }
    .stock-price {
      font-size: 0.85rem;
      color: #999;
    }
    .stock-quantity {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .quantity-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #FF6B35;
    }
    .quantity-value.low {
      color: #ff4444;
    }
    .quantity-label {
      font-size: 0.75rem;
      color: #999;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #999;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
      color: #999;
    }
    .empty-state p {
      margin: 0;
      font-size: 0.95rem;
    }

    /* Quick Actions */
    .quick-actions {
      margin-top: 2rem;
    }
    .quick-actions h2 {
      margin: 0 0 1.5rem;
      font-size: 1.3rem;
      color: white;
      font-weight: 600;
    }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    .action-card {
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      padding: 2rem;
      border-radius: 16px;
      border: 1px solid rgba(255, 107, 53, 0.15);
      text-decoration: none;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }
    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15);
      border-color: rgba(255, 107, 53, 0.3);
    }
    .action-icon {
      font-size: 1.8rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 107, 53, 0.1);
      border-radius: 12px;
      color: #FF6B35;
    }
    .action-text {
      font-weight: 600;
      font-size: 0.95rem;
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  loading = true;
  stats = {
    plats: 0,
    commandes: 0,
    clients: 0,
    reservations: 0
  };
  recentCommandes: any[] = [];
  stockFaible: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    forkJoin({
      plats: this.http.get<any[]>('https://final-resto.onrender.com/api/plats'),
      commandes: this.http.get<any[]>('https://final-resto.onrender.com/api/commandes'),
      clients: this.http.get<any[]>('https://final-resto.onrender.com/api/clients'),
      stocks: this.http.get<any[]>('https://final-resto.onrender.com/api/stocks')
    }).subscribe({
      next: (data) => {
        this.stats.plats = data.plats.length;
        this.stats.commandes = data.commandes.length;
        this.stats.clients = data.clients.length;
        this.recentCommandes = data.commandes.slice(0, 5);
        this.stockFaible = data.stocks.filter((s: any) => s.quantite < 10).slice(0, 5);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement dashboard:', err);
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
