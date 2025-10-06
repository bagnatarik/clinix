import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ordonnance } from '../../../core/interfaces/medical';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../core/services/api';

@Injectable({ providedIn: 'root' })
export class OrdonnancesService {
  private readonly baseUrl = `${API_BASE_URL}/ordonnances`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Ordonnance[]> { return this.http.get<Ordonnance[]>(this.baseUrl); }
  getById(id: string): Observable<Ordonnance | null> { return this.http.get<Ordonnance | null>(`${this.baseUrl}/${id}`); }
  create(item: Omit<Ordonnance, 'id'>): Observable<Ordonnance> { return this.http.post<Ordonnance>(this.baseUrl, item); }
  update(id: string, changes: Partial<Ordonnance>): Observable<Ordonnance | null> { return this.http.put<Ordonnance | null>(`${this.baseUrl}/${id}`, changes); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}