import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospitalisation } from '../../../core/interfaces/medical';
import { API_BASE_URL } from '../../../core/services/api';

@Injectable({ providedIn: 'root' })
export class HospitalisationsService {
  private baseUrl = `${API_BASE_URL}/hospitalisations`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Hospitalisation[]> { return this.http.get<Hospitalisation[]>(this.baseUrl); }
  create(item: Omit<Hospitalisation, 'id'>): Observable<Hospitalisation> { return this.http.post<Hospitalisation>(this.baseUrl, item); }
  update(id: string, changes: Partial<Hospitalisation>): Observable<Hospitalisation | null> { return this.http.put<Hospitalisation | null>(`${this.baseUrl}/${id}`, changes); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}