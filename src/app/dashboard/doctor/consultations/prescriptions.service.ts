import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';
import { PrescriptionRequest, PrescriptionResponse } from '../../../core/interfaces/medical';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private readonly baseUrl = `${API_BASE_URL}/prescription`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PrescriptionResponse[]> {
    return this.http.get<PrescriptionResponse[]>(`${this.baseUrl}/all`);
  }

  getByPublicId(publicId: string): Observable<PrescriptionResponse> {
    return this.http.get<PrescriptionResponse>(`${this.baseUrl}/get-one/${publicId}`);
  }

  create(payload: PrescriptionRequest): Observable<PrescriptionResponse> {
    return this.http.post<PrescriptionResponse>(`${this.baseUrl}/save`, payload);
  }

  update(publicId: string, payload: PrescriptionRequest): Observable<PrescriptionResponse> {
    return this.http.put<PrescriptionResponse>(`${this.baseUrl}/update/${publicId}`, payload);
  }

  deleteByPublicId(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`);
  }
}