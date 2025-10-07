import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';
import { HospitalisationRequest, HospitalisationResponse } from '../../../core/interfaces/medical';

@Injectable({ providedIn: 'root' })
export class HospitalisationService {
  private readonly baseUrl = `${API_BASE_URL}/hospitalisation`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<HospitalisationResponse[]> {
    return this.http.get<HospitalisationResponse[]>(`${this.baseUrl}/all`);
  }

  getByPublicId(publicId: string): Observable<HospitalisationResponse> {
    return this.http.get<HospitalisationResponse>(`${this.baseUrl}/get-one/${publicId}`);
  }

  create(payload: HospitalisationRequest): Observable<HospitalisationResponse> {
    return this.http.post<HospitalisationResponse>(`${this.baseUrl}/save`, payload);
  }

  update(publicId: string, payload: HospitalisationRequest): Observable<HospitalisationResponse> {
    return this.http.put<HospitalisationResponse>(`${this.baseUrl}/update/${publicId}`, payload);
  }

  deleteByPublicId(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`);
  }
}