import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InMemoryDatabaseService } from './in-memory-database.service';
import { Rendezvous } from '../interfaces/medical';

@Injectable({ providedIn: 'root' })
export class RendezvousService {
  constructor(private db: InMemoryDatabaseService) {}

  getAll(): Observable<Rendezvous[]> {
    return this.db.getRendezvous();
  }

  getById(id: string): Observable<Rendezvous | null> {
    return this.db.getRendezvousById(id);
  }

  create(item: Omit<Rendezvous, 'id'>): Observable<Rendezvous> {
    return this.db.createRendezvous(item);
  }

  update(id: string, changes: Partial<Rendezvous>): Observable<Rendezvous | null> {
    return this.db.updateRendezvous(id, changes);
  }

  delete(id: string): Observable<boolean> {
    return this.db.deleteRendezvous(id);
  }
}