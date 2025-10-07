import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';
import { AntecedentRequest, AntecedentResponse } from '../../../core/interfaces/medical';

@Injectable({ providedIn: 'root' })
export class AntecedentsService {
  private readonly baseUrl = `${API_BASE_URL}/antecedant`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AntecedentResponse[]> {
    return this.http.get<AntecedentResponse[]>(`${this.baseUrl}/all`);
  }

  getByPublicId(publicId: string): Observable<AntecedentResponse> {
    return this.http.get<AntecedentResponse>(`${this.baseUrl}/get-one/${publicId}`);
  }

  create(payload: AntecedentRequest): Observable<AntecedentResponse> {
    return this.http.post<AntecedentResponse>(`${this.baseUrl}/save`, payload);
  }

  update(publicId: string, payload: AntecedentRequest): Observable<AntecedentResponse> {
    return this.http.put<AntecedentResponse>(`${this.baseUrl}/update/${publicId}`, payload);
  }

  deleteByPublicId(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`);
  }
}
