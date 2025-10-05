import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  private patients: Patient[] = [
    {
      id: 'PAT-001',
      nom: 'Dubois',
      prenom: 'Alice',
      sexe: 'F',
      email: 'alice@example.com',
      telephone: '0600000001',
      adresse: '12 rue des Fleurs, Paris',
      dateNaissance: '1992-03-15',
      statut: 'actif',
    },
    {
      id: 'PAT-002',
      nom: 'Dupont',
      prenom: 'Jean',
      sexe: 'H',
      email: 'jean@example.com',
      telephone: '0600000002',
      adresse: '5 avenue Victor Hugo, Lyon',
      dateNaissance: '1986-07-02',
      statut: 'actif',
    },
  ];

  getAll(): Observable<Patient[]> {
    return of([...this.patients]);
  }

  getById(id: string): Observable<Patient | null> {
    return of(this.patients.find((p) => p.id === id) || null);
  }

  create(item: Omit<Patient, 'id'> & { id?: string }): Observable<Patient> {
    const id = item.id ?? `PAT-${String(this.patients.length + 1).padStart(3, '0')}`;
    const created: Patient = { ...item, id } as Patient;
    this.patients.push(created);
    return of(created);
  }

  update(id: string, changes: Partial<Patient>): Observable<Patient | null> {
    const idx = this.patients.findIndex((p) => p.id === id);
    if (idx === -1) return of(null);
    this.patients[idx] = { ...this.patients[idx], ...changes };
    return of(this.patients[idx]);
  }

  delete(id: string): Observable<boolean> {
    const initial = this.patients.length;
    this.patients = this.patients.filter((p) => p.id !== id);
    return of(this.patients.length < initial);
  }
}