import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consultation } from '../../../core/interfaces/medical';
import { InMemoryDatabaseService } from '../../../core/services/in-memory-database.service';

@Injectable({ providedIn: 'root' })
export class ConsultationsService {
  constructor(private db: InMemoryDatabaseService) {}

  getAll(): Observable<Consultation[]> {
    return this.db.getConsultations();
  }

  getById(id: string): Observable<Consultation | null> {
    return this.db.getConsultationById(id);
  }

  create(item: Omit<Consultation, 'id'>): Observable<Consultation> {
    return this.db.createConsultation(item);
  }

  update(id: string, changes: Partial<Consultation>): Observable<Consultation | null> {
    return this.db.updateConsultation(id, changes);
  }

  delete(id: string): Observable<boolean> {
    return this.db.deleteConsultation(id);
  }
}