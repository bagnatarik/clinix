import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../../core/interfaces/admin';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { API_BASE_URL } from '../../core/services/api';

@Injectable({ providedIn: 'root' })
export class ProduitsService {
  private baseUrl = `${API_BASE_URL}/produits`;
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  getAll(): Observable<Produit[]> { return this.http.get<Produit[]>(this.baseUrl); }
  create(item: Omit<Produit, 'id' | 'updatedBy'> & { id?: string }): Observable<Produit> {
    const user = this.auth.getCurrentUser();
    return this.http.post<Produit>(this.baseUrl, { ...item, updatedBy: user?.name });
  }
  update(id: string, changes: Partial<Produit>): Observable<Produit | null> {
    const user = this.auth.getCurrentUser();
    return this.http.put<Produit | null>(`${this.baseUrl}/${id}`, { ...changes, updatedBy: user?.name });
  }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}