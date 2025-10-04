import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diagnostic } from '../../../core/interfaces/medical';
import { InMemoryDatabaseService } from '../../../core/services/in-memory-database.service';

@Injectable({ providedIn: 'root' })
export class DiagnosticsService {
  constructor(private db: InMemoryDatabaseService) {}

  getAll(): Observable<Diagnostic[]> { return this.db.getDiagnostics(); }
  create(item: Omit<Diagnostic, 'id'>): Observable<Diagnostic> { return this.db.createDiagnostic(item); }
  update(id: string, changes: Partial<Diagnostic>): Observable<Diagnostic | null> { return this.db.updateDiagnostic(id, changes); }
  delete(id: string): Observable<boolean> { return this.db.deleteDiagnostic(id); }
}