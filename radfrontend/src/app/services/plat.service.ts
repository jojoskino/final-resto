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
  private apiUrl = 'http://localhost:8080/api/plats';

  constructor(private http: HttpClient) {}

  getAllPlats(): Observable<Plat[]> {
    return this.http.get<Plat[]>(this.apiUrl);
  }

  getPlatById(id: number): Observable<Plat> {
    return this.http.get<Plat>(`${this.apiUrl}/${id}`);
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/categories');
  }

  getCategories(): Observable<any[]> {
    return this.getAllCategories();
  }
}

