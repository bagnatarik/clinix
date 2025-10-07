import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';
import {
  AnalyseMedicaleRequest,
  AnalyseMedicaleResponse,
} from '../../../core/interfaces/medical';

@Injectable({ providedIn: 'root' })
export class AnalysesMedicalesService {
  private readonly baseUrl = `${API_BASE_URL}/analyseMedicale`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AnalyseMedicaleResponse[]> {
    // Selon les autres services, /all est parfois utilisé; on s'aligne si dispo.
    return this.http.get<AnalyseMedicaleResponse[]>(`${this.baseUrl}/all`);
  }

  getByPublicId(publicId: string): Observable<AnalyseMedicaleResponse | null> {
    return this.http.get<AnalyseMedicaleResponse | null>(`${this.baseUrl}/get-one/${publicId}`);
  }

  // Récupérer les analyses par diagnostique (plus pertinent côté UI)
  getByDiagnostiquePublicId(diagnostiquePublicId: string): Observable<AnalyseMedicaleResponse[]> {
    return this.http.get<AnalyseMedicaleResponse[]>(
      `${this.baseUrl}/by-diagnostic/${diagnostiquePublicId}`
    );
  }

  create(payload: AnalyseMedicaleRequest): Observable<AnalyseMedicaleResponse> {
    return this.http.post<AnalyseMedicaleResponse>(`${this.baseUrl}/save`, payload);
  }

  update(publicId: string, changes: Partial<AnalyseMedicaleRequest>): Observable<AnalyseMedicaleResponse | null> {
    return this.http.put<AnalyseMedicaleResponse | null>(`${this.baseUrl}/update/${publicId}`, {
      ...changes,
    });
  }

  deleteByPublicId(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`);
  }
}