import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/services/api';
import { Garde } from '../../core/interfaces/admin';

export interface CreateGardePayload {
  dateDebut: string; // LocalDate ISO (YYYY-MM-DD)
  // heureDebut: string; // HH:mm
  dateFin: string; // LocalDate ISO (YYYY-MM-DD)
  // heureFin: string; // HH:mm
}

export interface UpdateGardePayload extends CreateGardePayload {}

@Injectable({ providedIn: 'root' })
export class GardesService {
  private baseUrl = `${API_BASE_URL}/garde`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Garde[]> {
    return this.http.get<Garde[]>(`${this.baseUrl}/all`);
  }

  create(payload: CreateGardePayload): Observable<Garde> {
    return this.http.post<Garde>(`${this.baseUrl}/save`, payload);
  }

  update(publicId: string, payload: UpdateGardePayload): Observable<Garde> {
    return this.http.put<Garde>(`${this.baseUrl}/update/${publicId}`, payload);
  }

  delete(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`);
  }
}
