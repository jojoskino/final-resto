import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';

interface Utilisateur {
  idUtilisateur?: number;
  username: string;
  email: string;
  role: string;
  nom?: string;
  prenom?: string;
  actif: boolean;
  password?: string;
}

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="gestion-utilisateurs">
      <div class="page-header">
        <div class="header-content">
          <h1><i class="fas fa-users-cog"></i> Gestion des Utilisateurs</h1>
          <p class="subtitle">Créez et gérez les utilisateurs du système</p>
        </div>
        <button class="btn-primary" (click)="ouvrirModal()">
          <i class="fas fa-plus"></i> Ajouter un utilisateur
        </button>
      </div>

      <div *ngIf="loading && utilisateurs.length === 0" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>

      <div class="table-wrapper" *ngIf="!loading || utilisateurs.length > 0">
        <div *ngIf="loading && utilisateurs.length > 0" class="loading-overlay">
          <div class="spinner-small"></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let utilisateur of getUtilisateursPagines()">
              <td><span class="id-badge">#{{ utilisateur.idUtilisateur }}</span></td>
              <td><strong>{{ utilisateur.username }}</strong></td>
              <td>{{ utilisateur.email }}</td>
              <td>{{ utilisateur.nom || '-' }}</td>
              <td>{{ utilisateur.prenom || '-' }}</td>
              <td>
                <span class="badge" [ngClass]="getRoleBadgeClass(utilisateur.role)">
                  {{ getRoleLabel(utilisateur.role) }}
                </span>
              </td>
              <td>
                <span class="badge" [ngClass]="utilisateur.actif ? 'badge-success' : 'badge-danger'">
                  {{ utilisateur.actif ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td>
                <button class="btn-icon btn-edit" (click)="editerUtilisateur(utilisateur)" title="Modifier">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" (click)="demanderSuppression(utilisateur)" title="Supprimer" *ngIf="canDelete(utilisateur)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="utilisateurs.length === 0">
              <td colspan="8" class="empty-state">
                <div class="empty-icon"><i class="fas fa-users"></i></div>
                <p>Aucun utilisateur enregistré</p>
                <button class="btn-primary" (click)="ouvrirModal()">
                  Ajouter le premier utilisateur
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="utilisateurs.length > pageSize">
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
              <i class="fas" [class.fa-edit]="utilisateurEdit" [class.fa-plus]="!utilisateurEdit"></i> 
              {{ utilisateurEdit ? 'Modifier' : 'Ajouter' }} un utilisateur
            </h2>
            <button class="close-btn" (click)="fermerModal()"><i class="fas fa-times"></i></button>
          </div>
          <form (ngSubmit)="sauvegarderUtilisateur()" class="modal-form">
            <div class="form-group">
              <label>Nom d'utilisateur *</label>
              <input 
                type="text" 
                [(ngModel)]="formData.username" 
                name="username" 
                required
                [readonly]="!!utilisateurEdit"
                placeholder="Ex: john.doe"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input 
                type="email" 
                [(ngModel)]="formData.email" 
                name="email" 
                required
                placeholder="Ex: john@example.com"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Mot de passe {{ utilisateurEdit ? '(laisser vide pour ne pas changer)' : '*' }}</label>
              <input 
                type="password" 
                [(ngModel)]="formData.password" 
                name="password" 
                [required]="!utilisateurEdit"
                [minlength]="4"
                placeholder="Minimum 4 caractères"
                class="form-input"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Nom *</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.nom" 
                  name="nom" 
                  required
                  placeholder="Ex: Doe"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>Prénom</label>
                <input 
                  type="text" 
                  [(ngModel)]="formData.prenom" 
                  name="prenom" 
                  placeholder="Ex: John"
                  class="form-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Rôle *</label>
              <select 
                [(ngModel)]="formData.role" 
                name="role" 
                required
                class="form-input"
              >
                <option value="ADMIN">Administrateur</option>
                <option value="GESTIONNAIRE">Gérant</option>
                <option value="SERVEUR">Serveur</option>
                <option value="CLIENT">Client</option>
              </select>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="formData.actif" 
                  name="actif"
                  class="checkbox-input"
                />
                <span>Compte actif</span>
              </label>
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

      <!-- Dialog de confirmation de suppression -->
      <div class="confirm-dialog" [class.open]="confirmDeleteOpen" *ngIf="utilisateurASupprimer">
        <div class="confirm-content">
          <h3>Confirmer la suppression</h3>
          <p>Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{{ utilisateurASupprimer.username }}</strong> ?</p>
          <p class="warning-text">Cette action est irréversible.</p>
          <div class="confirm-actions">
            <button class="btn-secondary" (click)="confirmDeleteOpen = false">Annuler</button>
            <button class="btn-danger" (click)="supprimerUtilisateur()" [disabled]="loading">
              {{ loading ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gestion-utilisateurs {
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
    .badge-danger {
      background: rgba(244, 67, 54, 0.2);
      color: #F44336;
    }
    .badge-admin {
      background: rgba(156, 39, 176, 0.2);
      color: #9C27B0;
    }
    .badge-gestionnaire {
      background: rgba(33, 150, 243, 0.2);
      color: #2196F3;
    }
    .badge-serveur {
      background: rgba(255, 152, 0, 0.2);
      color: #FF9800;
    }
    .badge-client {
      background: rgba(158, 158, 158, 0.2);
      color: #9E9E9E;
    }
    .btn-icon {
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.6rem;
      border-radius: 8px;
      transition: all 0.2s ease;
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid;
      margin-right: 0.5rem;
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
    }
    .btn-delete {
      background: rgba(244, 67, 54, 0.15);
      border-color: rgba(244, 67, 54, 0.3);
      color: #F44336;
    }
    .btn-delete:hover {
      background: rgba(244, 67, 54, 0.3);
      border-color: rgba(244, 67, 54, 0.5);
      transform: scale(1.1);
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
      background: rgba(0, 0, 0, 0.5);
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
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.7rem;
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }
    .checkbox-input {
      width: 20px;
      height: 20px;
      cursor: pointer;
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
    .form-input[readonly] {
      background: #1A1A1A;
      opacity: 0.7;
      cursor: not-allowed;
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
    .confirm-dialog {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
    }
    .confirm-dialog.open {
      opacity: 1;
      visibility: visible;
    }
    .confirm-content {
      background: linear-gradient(135deg, #1A1A1A 0%, #151515 100%);
      border-radius: 16px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      border: 1px solid rgba(255, 107, 53, 0.2);
    }
    .confirm-content h3 {
      margin: 0 0 1rem;
      color: #FF6B35;
      font-size: 1.3rem;
    }
    .confirm-content p {
      margin: 0.5rem 0;
      color: #CCC;
    }
    .warning-text {
      color: #FF9800 !important;
      font-weight: 600;
    }
    .confirm-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }
    .btn-danger {
      padding: 0.9rem 1.8rem;
      background: #F44336;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }
    .btn-danger:hover:not(:disabled) {
      background: #E53935;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    }
    .btn-danger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      .page-header {
        flex-direction: column;
      }
    }
  `]
})
export class GestionUtilisateursComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];
  loading = false;
  modalOpen = false;
  utilisateurEdit: Utilisateur | null = null;
  confirmDeleteOpen = false;
  utilisateurASupprimer: Utilisateur | null = null;
  currentPage = 1;
  pageSize = 10;
  
  formData: Utilisateur = {
    username: '',
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: 'CLIENT',
    actif: true
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs() {
    this.loading = true;
    this.http.get<Utilisateur[]>('https://final-resto.onrender.com/api/utilisateurs').subscribe({
      next: (data) => {
        this.utilisateurs = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs:', err);
        this.utilisateurs = [];
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement des utilisateurs');
      }
    });
  }

  ouvrirModal() {
    this.utilisateurEdit = null;
    this.formData = {
      username: '',
      email: '',
      password: '',
      nom: '',
      prenom: '',
      role: 'CLIENT',
      actif: true
    };
    this.modalOpen = true;
  }

  fermerModal() {
    this.modalOpen = false;
    this.loading = false;
  }

  editerUtilisateur(utilisateur: Utilisateur) {
    this.utilisateurEdit = utilisateur;
    this.formData = {
      username: utilisateur.username,
      email: utilisateur.email,
      password: '', // Ne pas pré-remplir le mot de passe
      nom: utilisateur.nom || '',
      prenom: utilisateur.prenom || '',
      role: utilisateur.role,
      actif: utilisateur.actif
    };
    this.modalOpen = true;
  }

  sauvegarderUtilisateur() {
    if (!this.formData.username || !this.formData.email || !this.formData.nom) {
      this.notificationService.warning('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!this.utilisateurEdit && (!this.formData.password || this.formData.password.length < 4)) {
      this.notificationService.warning('Le mot de passe doit contenir au moins 4 caractères');
      return;
    }

    this.loading = true;

    const utilisateurData: any = {
      username: this.formData.username,
      email: this.formData.email,
      nom: this.formData.nom,
      prenom: this.formData.prenom || null,
      role: this.formData.role,
      actif: this.formData.actif
    };

    // Ajouter le mot de passe seulement s'il est fourni (pour la modification)
    if (this.formData.password && this.formData.password.length >= 4) {
      utilisateurData.password = this.formData.password;
    }

    if (this.utilisateurEdit) {
      // Modification
      this.http.put(`https://final-resto.onrender.com/api/utilisateurs/${this.utilisateurEdit.idUtilisateur}`, utilisateurData).subscribe({
        next: (response: any) => {
          this.notificationService.success('Utilisateur mis à jour avec succès');
          this.fermerModal();
          this.chargerUtilisateurs();
        },
        error: (err) => {
          console.error('Erreur mise à jour utilisateur:', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          this.notificationService.error(`Erreur lors de la mise à jour: ${errorMsg}`);
          this.loading = false;
        }
      });
    } else {
      // Création
      this.http.post('https://final-resto.onrender.com/api/utilisateurs', utilisateurData).subscribe({
        next: (response: any) => {
          this.notificationService.success('Utilisateur créé avec succès');
          this.fermerModal();
          this.chargerUtilisateurs();
        },
        error: (err) => {
          console.error('Erreur création utilisateur:', err);
          const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
          this.notificationService.error(`Erreur lors de la création: ${errorMsg}`);
          this.loading = false;
        }
      });
    }
  }

  demanderSuppression(utilisateur: Utilisateur) {
    this.utilisateurASupprimer = utilisateur;
    this.confirmDeleteOpen = true;
  }

  supprimerUtilisateur() {
    if (!this.utilisateurASupprimer || !this.utilisateurASupprimer.idUtilisateur) {
      return;
    }

    this.loading = true;
    this.http.delete(`https://final-resto.onrender.com/api/utilisateurs/${this.utilisateurASupprimer.idUtilisateur}`).subscribe({
      next: () => {
        this.notificationService.success('Utilisateur supprimé avec succès');
        this.confirmDeleteOpen = false;
        this.utilisateurASupprimer = null;
        this.chargerUtilisateurs();
      },
      error: (err) => {
        console.error('Erreur suppression utilisateur:', err);
        const errorMsg = err.error?.message || err.message || 'Erreur inconnue';
        this.notificationService.error(`Erreur lors de la suppression: ${errorMsg}`);
        this.loading = false;
      }
    });
  }

  canDelete(utilisateur: Utilisateur): boolean {
    const currentUser = this.authService.getCurrentUser();
    // Ne pas permettre de supprimer son propre compte
    if (currentUser && currentUser.id === utilisateur.idUtilisateur) {
      return false;
    }
    return true;
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

  getRoleBadgeClass(role: string): string {
    const classes: { [key: string]: string } = {
      'ADMIN': 'badge-admin',
      'GESTIONNAIRE': 'badge-gestionnaire',
      'SERVEUR': 'badge-serveur',
      'CLIENT': 'badge-client'
    };
    return classes[role] || 'badge';
  }

  getUtilisateursPagines() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.utilisateurs.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.utilisateurs.length / this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
}



