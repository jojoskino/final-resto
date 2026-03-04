import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'GESTIONNAIRE' | 'SERVEUR' | 'CLIENT';
  nom?: string;
  prenom?: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUserSubject.next(JSON.parse(userStr));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      username,
      password
    });
  }

  register(registrationData: {
    username: string;
    password: string;
    email: string;
    nom: string;
    prenom?: string;
  }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, registrationData);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  setCurrentUser(user: User, token?: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (token) {
      localStorage.setItem('token', token);
    }
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ADMIN';
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  isGestionnaire(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'GESTIONNAIRE';
  }

  isServeur(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'SERVEUR';
  }

  isClient(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'CLIENT';
  }

  canAccessFeature(feature: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    
    const role = user.role;
    
    // ADMIN a accès à tout
    if (role === 'ADMIN') return true;
    
    // GESTIONNAIRE (Gérant) a accès à presque tout
    if (role === 'GESTIONNAIRE') {
      return ['plats', 'commandes', 'stock', 'clients', 'reservations', 'categories', 'fournisseurs', 'finances'].includes(feature);
    }
    
    // SERVEUR a accès limité : commandes, réservations, plats
    if (role === 'SERVEUR') {
      return ['commandes', 'reservations', 'plats'].includes(feature);
    }
    
    return false;
  }
}

