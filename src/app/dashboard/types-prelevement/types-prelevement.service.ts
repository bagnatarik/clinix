import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/services/api';
import { TypePrelevement } from '../../core/interfaces/admin';

@Injectable({ providedIn: 'root' })
export class TypesPrelevementService {
  private readonly baseUrl = `${API_BASE_URL}/typePrelevement`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<TypePrelevement[]> {
    return this.http.get<TypePrelevement[]>(this.baseUrl + '/all');
  }
  create(libelle: string): Observable<TypePrelevement> {
    return this.http.post<TypePrelevement>(this.baseUrl + '/save', { libelle });
  }
  update(id: string, changes: Partial<TypePrelevement>): Observable<TypePrelevement | null> {
    return this.http.put<TypePrelevement | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}