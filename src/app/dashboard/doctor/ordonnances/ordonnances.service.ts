import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ordonnance } from '../../../core/interfaces/medical';
import { InMemoryDatabaseService } from '../../../core/services/in-memory-database.service';

@Injectable({ providedIn: 'root' })
export class OrdonnancesService {
  constructor(private db: InMemoryDatabaseService) {}

  getAll(): Observable<Ordonnance[]> { return this.db.getOrdonnances(); }
  getById(id: string): Observable<Ordonnance | null> { return this.db.getOrdonnanceById(id); }
  create(item: Omit<Ordonnance, 'id'>): Observable<Ordonnance> { return this.db.createOrdonnance(item); }
  update(id: string, changes: Partial<Ordonnance>): Observable<Ordonnance | null> { return this.db.updateOrdonnance(id, changes); }
  delete(id: string): Observable<boolean> { return this.db.deleteOrdonnance(id); }
}