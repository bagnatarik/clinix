import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Departement } from '../../core/interfaces/admin';
import { InMemoryDatabaseService } from '../../core/services/in-memory-database.service';
import { AuthenticationService } from '../../authentication/services/authentication-service';

@Injectable({ providedIn: 'root' })
export class DepartementsService {
  constructor(private db: InMemoryDatabaseService, private auth: AuthenticationService) {}

  getAll(): Observable<Departement[]> { return this.db.getDepartements(); }
  create(item: Omit<Departement, 'id' | 'updatedBy'> & { id?: string }): Observable<Departement> {
    const user = this.auth.getCurrentUser();
    return this.db.createDepartement({ ...item, updatedBy: user?.name });
  }
  update(id: string, changes: Partial<Departement>): Observable<Departement | null> {
    const user = this.auth.getCurrentUser();
    return this.db.updateDepartement(id, { ...changes, updatedBy: user?.name });
  }
  delete(id: string): Observable<boolean> { return this.db.deleteDepartement(id); }
}