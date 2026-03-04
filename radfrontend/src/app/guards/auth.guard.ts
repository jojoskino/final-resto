import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  // Vérifier si l'utilisateur a le rôle approprié pour accéder à /admin
  if (state.url.startsWith('/admin')) {
    const user = authService.getCurrentUser();
    // Les clients ne peuvent pas accéder à l'admin
    if (user?.role === 'CLIENT') {
      router.navigate(['/']);
      return false;
    }
    // ADMIN, GESTIONNAIRE et SERVEUR peuvent accéder
    if (!authService.isAdmin() && !authService.hasRole('GESTIONNAIRE') && !authService.hasRole('SERVEUR')) {
      router.navigate(['/']);
      return false;
    }
  }

  // Pour /historique, seuls les clients peuvent accéder
  if (state.url.startsWith('/historique')) {
    const user = authService.getCurrentUser();
    if (user?.role !== 'CLIENT') {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};


