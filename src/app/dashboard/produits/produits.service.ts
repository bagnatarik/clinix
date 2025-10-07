import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../../core/interfaces/admin';
import { API_BASE_URL } from '../../core/services/api';

@Injectable({ providedIn: 'root' })
export class ProduitsService {
  private baseUrl = `${API_BASE_URL}/produit`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.baseUrl + '/all');
  }
  create(item: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.baseUrl + '/save', {
      nom: item.nom,
      description: item.description,
      cout: item.cout,
    });
  }
  update(id: string, changes: Partial<Produit>): Observable<Produit | null> {
    return this.http.put<Produit | null>(`${this.baseUrl}/update/${id}`, {
      ...changes,
    });
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
