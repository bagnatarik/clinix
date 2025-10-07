import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';
import { DossierPatientResponse } from '../../../core/interfaces/medical';

@Injectable({ providedIn: 'root' })
export class DossierPatientService {
  private baseUrl = `${API_BASE_URL}/dossierPatient`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<DossierPatientResponse[]> {
    return this.http.get<DossierPatientResponse[]>(this.baseUrl);
  }

  getByPublicId(publicId: string): Observable<DossierPatientResponse | null> {
    return this.http.get<DossierPatientResponse | null>(`${this.baseUrl}/get-one/${publicId}`);
  }
}
