import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rubrique } from '../../core/interfaces/admin';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/services/api';

@Injectable({ providedIn: 'root' })
export class RubriquesService {
  private readonly baseUrl = `${API_BASE_URL}/rubrique`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Rubrique[]> {
    return this.http.get<Rubrique[]>(this.baseUrl + '/all');
  }
  create(libelle: string): Observable<Rubrique> {
    return this.http.post<Rubrique>(this.baseUrl + '/save', { libelle });
  }
  update(id: string, changes: Partial<Rubrique>): Observable<Rubrique | null> {
    return this.http.put<Rubrique | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}