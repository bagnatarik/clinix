import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';
import { PatientRequest, PatientResponse } from '../../../core/interfaces/medical';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private readonly baseUrl = `${API_BASE_URL}/patient`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PatientResponse[]> {
    return this.http.get<PatientResponse[]>(`${this.baseUrl}/all`);
  }

  getByPublicId(publicId: string): Observable<PatientResponse | null> {
    return this.http.get<PatientResponse | null>(`${this.baseUrl}/get-one/${publicId}`);
  }

  create(payload: PatientRequest): Observable<PatientResponse> {
    return this.http.post<PatientResponse>(`${this.baseUrl}/save`, payload);
  }

  update(publicId: string, changes: Partial<PatientRequest>): Observable<PatientResponse | null> {
    return this.http.put<PatientResponse | null>(`${this.baseUrl}/update/${publicId}`, {
      ...changes,
    });
  }

  deleteByPublicId(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`);
  }
}
