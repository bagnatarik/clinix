import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prescription } from '../../../core/interfaces/medical';
import { InMemoryDatabaseService } from '../../../core/services/in-memory-database.service';

@Injectable({ providedIn: 'root' })
export class PrescriptionsService {
  constructor(private db: InMemoryDatabaseService) {}

  getAll(): Observable<Prescription[]> { return this.db.getPrescriptions(); }
  getById(id: string): Observable<Prescription | null> { return this.db.getPrescriptionById(id); }
  create(item: Omit<Prescription, 'id'>): Observable<Prescription> { return this.db.createPrescription(item); }
  update(id: string, changes: Partial<Prescription>): Observable<Prescription | null> { return this.db.updatePrescription(id, changes); }
  delete(id: string): Observable<boolean> { return this.db.deletePrescription(id); }
}