import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Commande {
  idCommande?: number;
  dateCommande?: string;
  statut?: string;
  client?: {
    idClient: number;
    nom: string;
    prenom?: string;
    telephone?: string;
  };
  lignesCommande?: LigneCommande[];
  imageUrl?: string;
}

export interface LigneCommande {
  idLigne?: number;
  quantite: number;
  prixUnitaire: number;
  plat: {
    idPlat: number;
    nom: string;
    prix: number;
  };
}

export interface CommandeRequest {
  clientId?: number;
  utilisateurId?: number;
  lignesCommande: {
    platId: number;
    quantite: number;
    prixUnitaire: number;
  }[];
}

export interface CommandeResponse {
  idCommande: number;
  dateCommande: string;
  statut?: string;
  client?: {
    idClient: number;
    nom: string;
    prenom?: string;
  };
  lignesCommande?: LigneCommande[];
}

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'https://final-resto.onrender.com/api/commandes';

  constructor(private http: HttpClient) {}

  createCommande(commande: CommandeRequest): Observable<CommandeResponse> {
    return this.http.post<CommandeResponse>(this.apiUrl, commande);
  }

  getAllCommandes(): Observable<CommandeResponse[]> {
    return this.http.get<CommandeResponse[]>(this.apiUrl);
  }

  getCommandeById(id: number): Observable<CommandeResponse> {
    return this.http.get<CommandeResponse>(`${this.apiUrl}/${id}`);
  }

  getCommandesByUtilisateurId(utilisateurId: number): Observable<CommandeResponse[]> {
    return this.http.get<CommandeResponse[]>(`${this.apiUrl}/client/${utilisateurId}`);
  }

  updateStatut(id: number, statut: string): Observable<CommandeResponse> {
    return this.http.patch<CommandeResponse>(`${this.apiUrl}/${id}/statut`, { statut });
  }
}

