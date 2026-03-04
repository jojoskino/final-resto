import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PanierComponent } from './components/panier/panier.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, PanierComponent, NotificationsComponent, LoginComponent, RegisterComponent, CommonModule],
  template: `
    <app-header *ngIf="!isAdminRoute"></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="!isAdminRoute"></app-footer>
    <app-panier *ngIf="!isAdminRoute"></app-panier>
    <app-login *ngIf="!isAdminRoute" #loginModal></app-login>
    <app-register *ngIf="!isAdminRoute" #registerModal></app-register>
    <app-notifications></app-notifications>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  @ViewChild('registerModal') registerModal!: RegisterComponent;
  @ViewChild('loginModal') loginModal!: LoginComponent;
  isAdminRoute = false;
  private ouvrirRegisterHandler = () => this.ouvrirRegister();
  private ouvrirLoginHandler = () => this.ouvrirLogin();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAdminRoute = event.url.startsWith('/admin');
      });
    
    // Vérifier la route initiale
    this.isAdminRoute = this.router.url.startsWith('/admin');
  }

  ngOnInit() {
    window.addEventListener('ouvrirRegister', this.ouvrirRegisterHandler);
    window.addEventListener('ouvrirLogin', this.ouvrirLoginHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('ouvrirRegister', this.ouvrirRegisterHandler);
    window.removeEventListener('ouvrirLogin', this.ouvrirLoginHandler);
  }

  ouvrirRegister() {
    if (this.registerModal) {
      this.registerModal.ouvrirModal();
    }
  }

  ouvrirLogin() {
    if (this.loginModal) {
      this.loginModal.ouvrirModal();
    }
  }
}
