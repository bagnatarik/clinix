import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';
import { Analyse } from '../../../core/interfaces/admin';

@Injectable({ providedIn: 'root' })
export class AnalysesService {
  private readonly baseUrl = `${API_BASE_URL}/analyse`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Analyse[]> {
    return this.http.get<Analyse[]>(this.baseUrl + '/all');
  }

  create(libelle: string, cout: number): Observable<Analyse> {
    return this.http.post<Analyse>(this.baseUrl + '/save', { libelle, cout });
  }

  update(id: string, changes: Partial<Analyse>): Observable<Analyse | null> {
    return this.http.put<Analyse | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}