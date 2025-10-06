import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../../../core/interfaces/medical';
import { API_BASE_URL } from '../../../core/services/api';

@Injectable({ providedIn: 'root' })
export class ConsultationsService {
  private baseUrl = `${API_BASE_URL}/consultations`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(this.baseUrl);
  }

  getById(id: string): Observable<Consultation | null> {
    return this.http.get<Consultation | null>(`${this.baseUrl}/${id}`);
  }

  create(item: Omit<Consultation, 'id'>): Observable<Consultation> {
    return this.http.post<Consultation>(this.baseUrl, item);
  }

  update(id: string, changes: Partial<Consultation>): Observable<Consultation | null> {
    return this.http.put<Consultation | null>(`${this.baseUrl}/${id}`, changes);
  }

  delete(id: string): Observable<boolean> {
    try {
      this.http.delete<void>(`${this.baseUrl}/${id}`);
      return new Observable((observer) => observer.next(true));
    } catch {
      return new Observable((observer) => observer.next(false));
    }
  }
}
