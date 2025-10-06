import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../../../core/interfaces/medical';
import { API_BASE_URL } from '../../../core/services/api';

@Injectable({ providedIn: 'root' })
export class PrescriptionsService {
  private baseUrl = `${API_BASE_URL}/prescriptions`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Prescription[]> { return this.http.get<Prescription[]>(this.baseUrl); }
  getById(id: string): Observable<Prescription | null> { return this.http.get<Prescription | null>(`${this.baseUrl}/${id}`); }
  create(item: Omit<Prescription, 'id'>): Observable<Prescription> { return this.http.post<Prescription>(this.baseUrl, item); }
  update(id: string, changes: Partial<Prescription>): Observable<Prescription | null> { return this.http.put<Prescription | null>(`${this.baseUrl}/${id}`, changes); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}