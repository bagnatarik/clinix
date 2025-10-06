import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';

export type Patient = {
  id: string;
  nom: string;
  prenom: string;
  sexe: 'H' | 'F';
  email?: string;
  telephone?: string;
  adresse?: string;
  motDePasse?: string;
  antecedents?: { type: string; description: string }[];
  dateNaissance?: string;
  statut: 'actif' | 'inactif';
};

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private baseUrl = `${API_BASE_URL}/patients`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.baseUrl);
  }

  getById(id: string): Observable<Patient | null> {
    return this.http.get<Patient | null>(`${this.baseUrl}/${id}`);
  }

  create(item: Omit<Patient, 'id'> & { id?: string }): Observable<Patient> {
    return this.http.post<Patient>(this.baseUrl, item);
  }

  update(id: string, changes: Partial<Patient>): Observable<Patient | null> {
    return this.http.put<Patient | null>(`${this.baseUrl}/${id}`, changes);
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
