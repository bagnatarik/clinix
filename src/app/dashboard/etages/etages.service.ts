import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/services/api';
import { Etage } from '../../core/interfaces/admin';

@Injectable({ providedIn: 'root' })
export class EtagesService {
  private readonly baseUrl = `${API_BASE_URL}/etage`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Etage[]> {
    return this.http.get<Etage[]>(this.baseUrl + '/all');
  }
  create(libelle: string): Observable<Etage> {
    return this.http.post<Etage>(this.baseUrl + '/save', { libelle });
  }
  update(id: string, changes: Partial<Etage>): Observable<Etage | null> {
    return this.http.put<Etage | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}