import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal" [class.open]="isOpen" (click)="fermerModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2><i class="fas fa-user-plus"></i> Créer un compte</h2>
          <button class="close-btn" (click)="fermerModal()"><i class="fas fa-times"></i></button>
        </div>
        
        <form (ngSubmit)="sInscrire()" class="register-form" #registerForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label for="nom">Nom *</label>
              <input 
                type="text" 
                id="nom" 
                name="nom"
                [(ngModel)]="formData.nom" 
                required
                placeholder="Votre nom"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="prenom">Prénom</label>
              <input 
                type="text" 
                id="prenom" 
                name="prenom"
                [(ngModel)]="formData.prenom" 
                placeholder="Votre prénom"
                class="form-control"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="register-username">Nom d'utilisateur *</label>
            <input 
              type="text" 
              id="register-username" 
              name="username"
              [(ngModel)]="formData.username" 
              required
              minlength="3"
              placeholder="Choisissez un nom d'utilisateur"
              class="form-control"
            />
            <small class="form-hint">Minimum 3 caractères</small>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              [(ngModel)]="formData.email" 
              required
              email
              placeholder="votre@email.com"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="register-password">Mot de passe *</label>
            <div class="password-input-wrapper">
              <input 
                [type]="showPassword ? 'text' : 'password'"
                id="register-password" 
                name="password"
                [(ngModel)]="formData.password" 
                required
                minlength="4"
                placeholder="Minimum 4 caractères"
                class="form-control"
              />
              <button type="button" class="toggle-password" (click)="togglePasswordVisibility()">
                <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
              </button>
            </div>
            <small class="form-hint">Minimum 4 caractères</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe *</label>
            <div class="password-input-wrapper">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword" 
                name="confirmPassword"
                [(ngModel)]="formData.confirmPassword" 
                required
                placeholder="Répétez le mot de passe"
                class="form-control"
              />
              <button type="button" class="toggle-password" (click)="toggleConfirmPasswordVisibility()">
                <i class="fas" [class.fa-eye]="!showConfirmPassword" [class.fa-eye-slash]="showConfirmPassword"></i>
              </button>
            </div>
          </div>

          <div *ngIf="error" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>

          <button 
            type="submit" 
            class="btn-register"
            [disabled]="loading || !registerForm.valid || formData.password !== formData.confirmPassword">
            <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
            {{ loading ? 'Création en cours...' : 'Créer mon compte' }}
          </button>
        </form>

        <div class="register-footer">
          <p>Vous avez déjà un compte ? 
            <a href="#" (click)="basculerVersLogin($event)">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
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
      z-index: 3000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      backdrop-filter: blur(5px);
    }
    .modal.open {
      opacity: 1;
      visibility: visible;
    }
    .modal-content {
      background: #2A2A2A;
      padding: 0;
      border-radius: 20px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      color: white;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }
    .modal-header {
      padding: 2rem 2rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 165, 0, 0.2);
      position: sticky;
      top: 0;
      background: #2A2A2A;
      z-index: 1;
    }
    .modal-header h2 {
      margin: 0;
      color: #FFA500;
      font-size: 1.8rem;
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
      width: 35px;
      height: 35px;
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
    .register-form {
      padding: 2rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.7rem;
      color: white;
      font-weight: 500;
      font-size: 0.95rem;
    }
    .password-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .form-control {
      width: 100%;
      padding: 1rem;
      padding-right: 3rem;
      background: #1A1A1A;
      border: 2px solid rgba(255, 165, 0, 0.3);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: #FFA500;
      box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.1);
    }
    .toggle-password {
      position: absolute;
      right: 1rem;
      background: transparent;
      border: none;
      color: #FFA500;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-size: 1.1rem;
    }
    .toggle-password:hover {
      color: #FFB347;
      transform: scale(1.1);
    }
    .form-control::placeholder {
      color: #666;
    }
    .form-hint {
      display: block;
      margin-top: 0.5rem;
      color: #999;
      font-size: 0.85rem;
    }
    .error-message {
      background: rgba(244, 67, 54, 0.2);
      color: #F44336;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border: 1px solid rgba(244, 67, 54, 0.3);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-register {
      width: 100%;
      padding: 1.2rem;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.25);
    }
    .btn-register:hover:not(:disabled) {
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 165, 0, 0.35);
    }
    .btn-register:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .register-footer {
      padding: 1.5rem 2rem 2rem;
      background: rgba(255, 165, 0, 0.05);
      border-top: 1px solid rgba(255, 165, 0, 0.2);
      text-align: center;
    }
    .register-footer p {
      margin: 0;
      color: #999;
      font-size: 0.95rem;
    }
    .register-footer a {
      color: #FFA500;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }
    .register-footer a:hover {
      color: #FFB347;
    }
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      .modal-content {
        max-width: 95%;
      }
    }
  `]
})
export class RegisterComponent {
  isOpen = false;
  loading = false;
  error: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  formData = {
    username: '',
    password: '',
    email: '',
    nom: '',
    prenom: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ouvrirModal() {
    this.isOpen = true;
    this.error = null;
    this.formData = {
      username: '',
      password: '',
      email: '',
      nom: '',
      prenom: '',
      confirmPassword: ''
    };
  }

  fermerModal() {
    this.isOpen = false;
    this.error = null;
    this.showPassword = false;
    this.showConfirmPassword = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  basculerVersLogin(event: Event) {
    event.preventDefault();
    this.fermerModal();
    // Émettre un événement pour ouvrir le modal de connexion
    setTimeout(() => {
      const customEvent = new CustomEvent('ouvrirLogin');
      window.dispatchEvent(customEvent);
    }, 300);
  }

  sInscrire() {
    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.formData.password.length < 4) {
      this.error = 'Le mot de passe doit contenir au moins 4 caractères';
      return;
    }

    this.loading = true;
    this.error = null;

    const registrationData = {
      username: this.formData.username.trim(),
      password: this.formData.password,
      email: this.formData.email.trim(),
      nom: this.formData.nom.trim(),
      prenom: this.formData.prenom?.trim() || undefined
    };

    this.authService.register(registrationData).subscribe({
      next: (response: any) => {
        if (response.user) {
          const user: User = {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            role: response.user.role,
            nom: response.user.nom,
            prenom: response.user.prenom
          };
          this.authService.setCurrentUser(user);
          this.fermerModal();
          this.notificationService.success('Compte créé avec succès ! Bienvenue !');
          this.router.navigate(['/']);
        } else {
          this.error = response.message || 'Erreur lors de la création du compte';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création du compte. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }
}

