import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/services/api';

export type Patient = {
  publicId: string;
  id?: string;
  nom: string;
  prenom: string;
  sexe: 'H' | 'F';
  email?: string;
  telephone?: string;
  adresse?: string;
  motDePasse?: string;
  antecedents?: { type: string; description: string }[];
  dateNaissance?: string;
  numeroDossier?: string;
  dossierPublicId?: string;
  statut: 'actif' | 'inactif';
};

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private baseUrl = `${API_BASE_URL}/patient`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/all`);
  }

  getById(publicId: string): Observable<Patient | null> {
    return this.http.get<Patient | null>(`${this.baseUrl}/get-one/${publicId}`);
  }

  create(item: Omit<Patient, 'publicId'> & { publicId?: string }): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/save`, item);
  }

  update(publicId: string, changes: Partial<Patient>): Observable<Patient | null> {
    return this.http.put<Patient | null>(`${this.baseUrl}/update/${publicId}`, changes);
  }

  delete(publicId: string): Observable<boolean> {
    try {
      this.http.delete<void>(`${this.baseUrl}/delete/${publicId}`).subscribe();
      return new Observable((observer) => observer.next(true));
    } catch {
      return new Observable((observer) => observer.next(false));
    }
  }
}
