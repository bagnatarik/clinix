import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/services/api';
import { TypeChambre } from '../../core/interfaces/admin';

@Injectable({ providedIn: 'root' })
export class TypesChambreService {
  private readonly baseUrl = `${API_BASE_URL}/typeChambre`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeChambre[]> {
    return this.http.get<TypeChambre[]>(this.baseUrl + '/all');
  }
  create(libelle: string): Observable<TypeChambre> {
    return this.http.post<TypeChambre>(this.baseUrl + '/save', { libelle });
  }
  update(id: string, changes: Partial<TypeChambre>): Observable<TypeChambre | null> {
    return this.http.put<TypeChambre | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}