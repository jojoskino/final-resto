import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { GalerieComponent } from './pages/galerie/galerie.component';
import { HistoriqueComponent } from './pages/historique/historique.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { GestionPlatsComponent } from './admin/pages/gestion-plats/gestion-plats.component';
import { GestionCommandesComponent } from './admin/pages/gestion-commandes/gestion-commandes.component';
import { GestionStockComponent } from './admin/pages/gestion-stock/gestion-stock.component';
import { GestionClientsComponent } from './admin/pages/gestion-clients/gestion-clients.component';
import { GestionReservationsComponent } from './admin/pages/gestion-reservations/gestion-reservations.component';
import { GestionCategoriesComponent } from './admin/pages/gestion-categories/gestion-categories.component';
import { GestionFournisseursComponent } from './admin/pages/gestion-fournisseurs/gestion-fournisseurs.component';
import { GestionFinancesComponent } from './admin/pages/gestion-finances/gestion-finances.component';
import { GestionUtilisateursComponent } from './admin/pages/gestion-utilisateurs/gestion-utilisateurs.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'galerie', component: GalerieComponent },
  { path: 'historique', component: HistoriqueComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'plats', component: GestionPlatsComponent },
      { path: 'commandes', component: GestionCommandesComponent },
      { path: 'stock', component: GestionStockComponent },
      { path: 'clients', component: GestionClientsComponent },
      { path: 'reservations', component: GestionReservationsComponent },
      { path: 'categories', component: GestionCategoriesComponent },
      { path: 'fournisseurs', component: GestionFournisseursComponent },
      { path: 'finances', component: GestionFinancesComponent },
      { path: 'utilisateurs', component: GestionUtilisateursComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
