import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Departement } from '../../core/interfaces/admin';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/services/api';

@Injectable({ providedIn: 'root' })
export class DepartementsService {
  private readonly baseUrl = `${API_BASE_URL}/departement`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Departement[]> {
    return this.http.get<Departement[]>(this.baseUrl + '/all');
  }
  create(libelle: string): Observable<Departement> {
    return this.http.post<Departement>(this.baseUrl + '/save', { libelle });
  }
  update(id: string, changes: Partial<Departement>): Observable<Departement | null> {
    return this.http.put<Departement | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }
  delete(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/delete/${id}`);
  }
}
