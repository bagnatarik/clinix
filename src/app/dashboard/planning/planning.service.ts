import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/services/api';
import { PlanningRequest, PlanningResponse } from '../../core/interfaces/admin';

@Injectable({ providedIn: 'root' })
export class PlanningService {
  private readonly baseUrl = `${API_BASE_URL}/planning`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<PlanningResponse[]> {
    return this.http.get<PlanningResponse[]>(this.baseUrl + '/all');
  }

  create(payload: PlanningRequest): Observable<PlanningResponse> {
    return this.http.post<PlanningResponse>(this.baseUrl + '/save', payload);
  }

  update(id: string, payload: PlanningRequest): Observable<PlanningResponse> {
    return this.http.put<PlanningResponse>(`${this.baseUrl}/update/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}