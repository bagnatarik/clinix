import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profession } from '../../core/interfaces/admin';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/services/api';

@Injectable({ providedIn: 'root' })
export class ProfessionsService {
  private readonly baseUrl = `${API_BASE_URL}/profession`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Profession[]> {
    return this.http.get<Profession[]>(this.baseUrl + '/all');
  }
  create(libelle: string): Observable<Profession> {
    return this.http.post<Profession>(this.baseUrl + '/save', { libelle });
  }
  update(id: string, changes: Partial<Profession>): Observable<Profession | null> {
    return this.http.put<Profession | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}