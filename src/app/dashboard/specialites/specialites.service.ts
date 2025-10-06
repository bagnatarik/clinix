import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Specialite } from '../../core/interfaces/admin';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/services/api';

@Injectable({ providedIn: 'root' })
export class SpecialitesService {
  private readonly baseUrl = `${API_BASE_URL}/specialite`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Specialite[]> {
    return this.http.get<Specialite[]>(this.baseUrl + '/all');
  }
  create(libelle: string): Observable<Specialite> {
    return this.http.post<Specialite>(this.baseUrl + '/save', { libelle });
  }
  update(id: string, changes: Partial<Specialite>): Observable<Specialite | null> {
    return this.http.put<Specialite | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
