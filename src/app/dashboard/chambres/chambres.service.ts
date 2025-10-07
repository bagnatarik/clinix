import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/services/api';
import { Chambre, ChambreRequest } from '../../core/interfaces/admin';

@Injectable({ providedIn: 'root' })
export class ChambresService {
  private baseUrl = `${API_BASE_URL}/chambre`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.baseUrl}/all`);
  }

  create(payload: ChambreRequest): Observable<Chambre> {
    return this.http.post<Chambre>(`${this.baseUrl}/save`, payload);
  }

  update(publicId: string, payload: ChambreRequest): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.baseUrl}/update/${publicId}`, payload);
  }

  delete(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`);
  }
}