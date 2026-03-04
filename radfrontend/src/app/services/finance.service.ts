import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Depense {
  idDepense?: number;
  libelle: string;
  montant: number;
  description?: string;
  typeDepense: 'ACHAT_PRODUITS' | 'SALAIRES' | 'LOYER' | 'UTILITAIRES' | 'MAINTENANCE' | 'MARKETING' | 'AUTRE';
  dateDepense: string;
  fournisseur?: {
    idFournisseur: number;
    nom: string;
  };
}

export interface Vente {
  idCommande: number;
  dateCommande: string;
  montant: number;
  client: {
    nom: string;
    prenom?: string;
  };
}

export interface ResumeFinancier {
  totalVentes: number;
  totalDepenses: number;
  benefice: number;
  ventesMois: number;
  depensesMois: number;
  beneficeMois: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = 'http://localhost:8080/api';
  
  constructor(private http: HttpClient) {}

  // Dépenses
  getAllDepenses(): Observable<Depense[]> {
    return this.http.get<Depense[]>(`${this.apiUrl}/depenses`);
  }

  getDepenseById(id: number): Observable<Depense> {
    return this.http.get<Depense>(`${this.apiUrl}/depenses/${id}`);
  }

  createDepense(depense: Depense): Observable<Depense> {
    return this.http.post<Depense>(`${this.apiUrl}/depenses`, depense);
  }

  updateDepense(id: number, depense: Depense): Observable<Depense> {
    return this.http.put<Depense>(`${this.apiUrl}/depenses/${id}`, depense);
  }

  deleteDepense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/depenses/${id}`);
  }

  getTotalDepenses(start: string, end: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/depenses/total?start=${start}&end=${end}`);
  }

  // Ventes (via commandes)
  getAllVentes(): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}/commandes`);
  }

  getResumeFinancier(start: string, end: string): Observable<ResumeFinancier> {
    return this.http.get<ResumeFinancier>(`${this.apiUrl}/finance/resume?start=${start}&end=${end}`);
  }
}





