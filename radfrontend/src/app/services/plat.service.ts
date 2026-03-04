import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Plat {
  idPlat?: number;
  nom: string;
  description: string;
  prix: number;
  imageUrl?: string;
  categorie?: {
    id?: number;
    nom: string;
    description?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PlatService {
  private apiUrl = 'https://final-resto.onrender.com/api/plats';

  constructor(private http: HttpClient) {}

  getAllPlats(): Observable<Plat[]> {
    return this.http.get<Plat[]>(this.apiUrl);
  }

  getPlatById(id: number): Observable<Plat> {
    return this.http.get<Plat>(`${this.apiUrl}/${id}`);
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>('https://final-resto.onrender.com/api/categories');
  }

  getCategories(): Observable<any[]> {
    return this.getAllCategories();
  }
}

