import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Consultation,
  ConsultationRequest,
  ConsultationResponse,
} from '../../../core/interfaces/medical';
import { API_BASE_URL } from '../../../core/services/api';

@Injectable({ providedIn: 'root' })
export class ConsultationsService {
  private baseUrl = `${API_BASE_URL}/consultation`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(this.baseUrl + '/all');
  }

  getById(id: string): Observable<Consultation | null> {
    return this.http.get<Consultation | null>(`${this.baseUrl}/get-one/${id}`);
  }

  create(item: Omit<Consultation, 'id'>): Observable<Consultation> {
    return this.http.post<Consultation>(this.baseUrl + '/save', item);
  }

  update(id: string, changes: Partial<Consultation>): Observable<Consultation | null> {
    return this.http.put<Consultation | null>(`${this.baseUrl}/update/${id}`, changes);
  }

  delete(id: string): Observable<boolean> {
    try {
      this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
      return new Observable((observer) => observer.next(true));
    } catch {
      return new Observable((observer) => observer.next(false));
    }
  }

  // --- V2 DTOs (backend nouveaux contrats) ---
  getAllV2(): Observable<ConsultationResponse[]> {
    return this.http.get<ConsultationResponse[]>(this.baseUrl + '/all');
  }

  getByPublicId(publicId: string): Observable<ConsultationResponse | null> {
    return this.http.get<ConsultationResponse | null>(`${this.baseUrl}/get-one/${publicId}`);
  }

  createV2(payload: ConsultationRequest): Observable<ConsultationResponse> {
    return this.http.post<ConsultationResponse>(this.baseUrl + '/save', payload);
  }

  updateV2(
    publicId: string,
    changes: Partial<ConsultationRequest>
  ): Observable<ConsultationResponse | null> {
    return this.http.put<ConsultationResponse | null>(
      `${this.baseUrl}/update/${publicId}`,
      changes
    );
  }

  deleteByPublicId(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`);
  }
}
