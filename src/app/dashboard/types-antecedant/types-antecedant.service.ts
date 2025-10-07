import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/services/api';
import { TypeAntecedant } from '../../core/interfaces/admin';

@Injectable({ providedIn: 'root' })
export class TypesAntecedantService {
  private readonly baseUrl = `${API_BASE_URL}/typeAntecedant`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeAntecedant[]> {
    return this.http.get<TypeAntecedant[]>(this.baseUrl + '/all');
  }
  create(libelle: string): Observable<TypeAntecedant> {
    return this.http.post<TypeAntecedant>(this.baseUrl + '/save', { libelle });
  }
  update(id: string, changes: Partial<TypeAntecedant>): Observable<TypeAntecedant | null> {
    return this.http.put<TypeAntecedant | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}