import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';
import { DiagnostiqueRequest, DiagnostiqueResponse } from '../../../core/interfaces/medical';

@Injectable({ providedIn: 'root' })
export class DiagnostiqueService {
  private readonly baseUrl = `${API_BASE_URL}/diagnostique`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DiagnostiqueResponse[]> {
    return this.http.get<DiagnostiqueResponse[]>(`${this.baseUrl}/all`);
  }

  getByPublicId(publicId: string): Observable<DiagnostiqueResponse> {
    return this.http.get<DiagnostiqueResponse>(`${this.baseUrl}/get-one/${publicId}`);
  }

  create(payload: DiagnostiqueRequest): Observable<DiagnostiqueResponse> {
    return this.http.post<DiagnostiqueResponse>(`${this.baseUrl}/save`, payload);
  }

  update(publicId: string, payload: DiagnostiqueRequest): Observable<DiagnostiqueResponse> {
    return this.http.put<DiagnostiqueResponse>(`${this.baseUrl}/update/${publicId}`, payload);
  }

  deleteByPublicId(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`);
  }
}