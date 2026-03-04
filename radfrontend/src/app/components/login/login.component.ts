import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal" [class.open]="isOpen" (click)="fermerModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2><i class="fas fa-lock"></i> Connexion</h2>
          <button class="close-btn" (click)="fermerModal()"><i class="fas fa-times"></i></button>
        </div>
        
        <form (ngSubmit)="seConnecter()" class="login-form">
          <div class="form-group">
            <label for="login-username">Nom d'utilisateur *</label>
            <input 
              type="text" 
              id="login-username" 
              name="username"
              [(ngModel)]="credentials.username" 
              required
              placeholder="admin"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="login-password">Mot de passe *</label>
            <div class="password-input-wrapper">
              <input 
                [type]="showPassword ? 'text' : 'password'"
                id="login-password" 
                name="password"
                [(ngModel)]="credentials.password" 
                required
                placeholder="••••••••"
                class="form-control"
              />
              <button type="button" class="toggle-password" (click)="togglePasswordVisibility()">
                <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
              </button>
            </div>
          </div>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <button 
            type="submit" 
            class="btn-login"
            [disabled]="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <div class="login-footer">
          <p class="footer-text">Vous n'avez pas de compte ?</p>
          <a href="#" (click)="basculerVersInscription($event)" class="footer-link">
            <i class="fas fa-user-plus"></i> Créer un compte
          </a>
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
      max-width: 450px;
      color: white;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      padding: 2rem 2rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 165, 0, 0.3);
      background: linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 179, 71, 0.05) 100%);
    }
    .modal-header h2 {
      margin: 0;
      color: #FFA500;
      font-size: 1.8rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
    }
    .modal-header h2 i {
      color: #FFA500;
    }
    .close-btn {
      background: rgba(255, 165, 0, 0.15);
      border: 1px solid rgba(255, 165, 0, 0.3);
      color: #FFA500;
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
      background: rgba(255, 165, 0, 0.25);
      border-color: rgba(255, 165, 0, 0.5);
      color: #FFB347;
      transform: rotate(90deg);
    }
    .login-form {
      padding: 2rem;
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
      border: 2px solid rgba(255, 165, 0, 0.4);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    .form-control:focus {
      outline: none;
      border-color: #FFA500;
      box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.2);
      background: #1F1F1F;
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
    .error-message {
      background: rgba(244, 67, 54, 0.2);
      color: #F44336;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border: 1px solid rgba(244, 67, 54, 0.3);
    }
    .btn-login {
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
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .btn-login:hover:not(:disabled) {
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 165, 0, 0.4);
    }
    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .login-footer {
      padding: 1.5rem 2rem 2rem;
      background: linear-gradient(135deg, rgba(255, 165, 0, 0.15) 0%, rgba(255, 179, 71, 0.08) 100%);
      border-top: 2px solid rgba(255, 165, 0, 0.4);
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }
    .footer-text {
      margin: 0;
      color: #CCC;
      font-size: 0.95rem;
    }
    .footer-link {
      color: white;
      text-decoration: none;
      font-weight: 700;
      transition: all 0.2s ease;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #FFA500 0%, #FFB347 100%);
      box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
      font-size: 0.95rem;
    }
    .footer-link:hover {
      background: linear-gradient(135deg, #FFB347 0%, #FFC966 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 165, 0, 0.4);
      color: white;
    }
    .footer-link i {
      font-size: 1rem;
    }
  `]
})
export class LoginComponent {
  isOpen = false;
  loading = false;
  error: string | null = null;
  showPassword = false;
  credentials = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ouvrirModal() {
    this.isOpen = true;
    this.error = null;
    this.credentials = { username: '', password: '' };
  }

  fermerModal() {
    this.isOpen = false;
    this.error = null;
    this.showPassword = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  basculerVersInscription(event: Event) {
    event.preventDefault();
    this.fermerModal();
    // Émettre un événement pour ouvrir le modal d'inscription
    setTimeout(() => {
      const customEvent = new CustomEvent('ouvrirRegister');
      window.dispatchEvent(customEvent);
    }, 300);
  }

  seConnecter() {
    this.loading = true;
    this.error = null;

    this.authService.login(this.credentials.username, this.credentials.password).subscribe({
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
          this.authService.setCurrentUser(user, response.token);
          this.fermerModal();
          
          // Rediriger selon le rôle
          if (user.role === 'ADMIN' || user.role === 'GESTIONNAIRE') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.error = response.message || 'Erreur de connexion';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
        this.loading = false;
      }
    });
  }
}

