import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Plat } from './plat.service';
import { AuthService } from './auth.service';

export interface ItemPanier {
  plat: Plat;
  quantite: number;
}

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private panierSubject = new BehaviorSubject<ItemPanier[]>([]);
  public panier$ = this.panierSubject.asObservable();
  private currentUserId: number | null = null;

  constructor(private authService: AuthService) {
    // Écouter les changements d'utilisateur
    this.authService.currentUser$.subscribe(user => {
      const newUserId = user?.id || null;
      
      // Si l'utilisateur a changé, gérer le panier en conséquence
      if (this.currentUserId !== newUserId) {
        const previousUserId = this.currentUserId;
        const panierActuel = this.panierSubject.value;
        
        // Sauvegarder le panier de l'ancien utilisateur avant de changer
        if (previousUserId !== null) {
          this.sauvegarderPanier(previousUserId);
        } else if (panierActuel.length > 0) {
          // Si on était visiteur et qu'on a un panier, le sauvegarder
          localStorage.setItem('panier_visiteur', JSON.stringify(panierActuel));
        }
        
        this.currentUserId = newUserId;
        
        // Charger le panier du nouvel utilisateur ou vider si déconnexion
        if (newUserId !== null) {
          // Charger le panier de l'utilisateur
          const panierUtilisateur = this.chargerPanier(newUserId);
          
          // Si le panier visiteur avait des items, les fusionner avec le panier utilisateur
          if (previousUserId === null && panierActuel.length > 0) {
            const panierFusionne = this.fusionnerPaniers(panierUtilisateur, panierActuel);
            this.panierSubject.next(panierFusionne);
          } else {
            this.panierSubject.next(panierUtilisateur);
          }
        } else {
          // Si déconnexion, charger le panier visiteur s'il existe, sinon vider
          const panierVisiteur = localStorage.getItem('panier_visiteur');
          if (panierVisiteur) {
            try {
              this.panierSubject.next(JSON.parse(panierVisiteur));
            } catch (e) {
              console.error('Erreur lors du chargement du panier visiteur:', e);
              this.panierSubject.next([]);
            }
          } else {
            this.panierSubject.next([]);
          }
        }
      }
    });
    
    // Sauvegarder le panier dans localStorage à chaque changement
    this.panier$.subscribe(panier => {
      if (this.currentUserId !== null) {
        this.sauvegarderPanier(this.currentUserId);
      } else {
        // Si pas d'utilisateur connecté, sauvegarder dans le panier global (pour les visiteurs)
        localStorage.setItem('panier_visiteur', JSON.stringify(panier));
      }
    });
    
    // Charger le panier initial (visiteur ou utilisateur connecté)
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user.id;
      this.chargerPanier(user.id);
    } else {
      // Charger le panier visiteur
      const panierVisiteur = localStorage.getItem('panier_visiteur');
      if (panierVisiteur) {
        this.panierSubject.next(JSON.parse(panierVisiteur));
      }
    }
  }

  private getPanierKey(userId: number): string {
    return `panier_${userId}`;
  }

  private chargerPanier(userId: number): ItemPanier[] {
    const panierStocke = localStorage.getItem(this.getPanierKey(userId));
    if (panierStocke) {
      try {
        return JSON.parse(panierStocke);
      } catch (e) {
        console.error('Erreur lors du chargement du panier:', e);
        return [];
      }
    } else {
      return [];
    }
  }

  private fusionnerPaniers(panier1: ItemPanier[], panier2: ItemPanier[]): ItemPanier[] {
    const panierFusionne = [...panier1];
    
    panier2.forEach(item2 => {
      const itemExistant = panierFusionne.find(item => item.plat.idPlat === item2.plat.idPlat);
      if (itemExistant) {
        // Si le plat existe déjà, additionner les quantités
        itemExistant.quantite += item2.quantite;
      } else {
        // Sinon, ajouter l'item
        panierFusionne.push({ ...item2 });
      }
    });
    
    return panierFusionne;
  }

  private sauvegarderPanier(userId: number): void {
    const panier = this.panierSubject.value;
    localStorage.setItem(this.getPanierKey(userId), JSON.stringify(panier));
  }

  ajouterAuPanier(plat: Plat, quantite: number = 1): void {
    const panierActuel = this.panierSubject.value;
    const itemExistant = panierActuel.find(item => item.plat.idPlat === plat.idPlat);

    if (itemExistant) {
      itemExistant.quantite += quantite;
    } else {
      panierActuel.push({ plat, quantite });
    }

    this.panierSubject.next([...panierActuel]);
  }

  retirerDuPanier(platId: number): void {
    const panierActuel = this.panierSubject.value.filter(
      item => item.plat.idPlat !== platId
    );
    this.panierSubject.next(panierActuel);
  }

  modifierQuantite(platId: number, quantite: number): void {
    if (quantite <= 0) {
      this.retirerDuPanier(platId);
      return;
    }

    const panierActuel = this.panierSubject.value.map(item =>
      item.plat.idPlat === platId ? { ...item, quantite } : item
    );
    this.panierSubject.next(panierActuel);
  }

  viderPanier(): void {
    this.panierSubject.next([]);
  }

  getTotal(): number {
    return this.panierSubject.value.reduce(
      (total, item) => total + item.plat.prix * item.quantite,
      0
    );
  }

  getNombreItems(): number {
    return this.panierSubject.value.reduce(
      (total, item) => total + item.quantite,
      0
    );
  }

  getPanier(): ItemPanier[] {
    return this.panierSubject.value;
  }
}


