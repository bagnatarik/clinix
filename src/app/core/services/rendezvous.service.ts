import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rendezvous } from '../interfaces/medical';
import { API_BASE_URL } from './api';

@Injectable({ providedIn: 'root' })
export class RendezvousService {
  private baseUrl = `${API_BASE_URL}/rendezvous`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Rendezvous[]> {
    return this.http.get<Rendezvous[]>(this.baseUrl);
  }

  getById(id: string): Observable<Rendezvous | null> {
    return this.http.get<Rendezvous | null>(`${this.baseUrl}/${id}`);
  }

  create(item: Omit<Rendezvous, 'id'>): Observable<Rendezvous> {
    return this.http.post<Rendezvous>(this.baseUrl, item);
  }

  update(id: string, changes: Partial<Rendezvous>): Observable<Rendezvous | null> {
    return this.http.put<Rendezvous | null>(`${this.baseUrl}/${id}`, changes);
  }

  delete(id: string): Observable<boolean> {
    try {
      this.http.delete<void>(`${this.baseUrl}/${id}`).subscribe();
      return new Observable((observer) => observer.next(true));
    } catch {
      return new Observable((observer) => observer.next(false));
    }
  }
}
