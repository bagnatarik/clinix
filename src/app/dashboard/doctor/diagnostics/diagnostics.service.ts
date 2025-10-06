import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diagnostic } from '../../../core/interfaces/medical';
import { API_BASE_URL } from '../../../core/services/api';

@Injectable({ providedIn: 'root' })
export class DiagnosticsService {
  private baseUrl = `${API_BASE_URL}/diagnostics`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Diagnostic[]> { return this.http.get<Diagnostic[]>(this.baseUrl); }
  create(item: Omit<Diagnostic, 'id'>): Observable<Diagnostic> { return this.http.post<Diagnostic>(this.baseUrl, item); }
  update(id: string, changes: Partial<Diagnostic>): Observable<Diagnostic | null> { return this.http.put<Diagnostic | null>(`${this.baseUrl}/${id}`, changes); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}