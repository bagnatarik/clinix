import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Specialite } from '../../core/interfaces/admin';
import { InMemoryDatabaseService } from '../../core/services/in-memory-database.service';
import { AuthenticationService } from '../../authentication/services/authentication-service';

@Injectable({ providedIn: 'root' })
export class SpecialitesService {
  constructor(private db: InMemoryDatabaseService, private auth: AuthenticationService) {}

  getAll(): Observable<Specialite[]> { return this.db.getSpecialites(); }
  create(item: Omit<Specialite, 'id' | 'updatedBy'> & { id?: string }): Observable<Specialite> {
    const user = this.auth.getCurrentUser();
    return this.db.createSpecialite({ ...item, updatedBy: user?.name });
  }
  update(id: string, changes: Partial<Specialite>): Observable<Specialite | null> {
    const user = this.auth.getCurrentUser();
    return this.db.updateSpecialite(id, { ...changes, updatedBy: user?.name });
  }
  delete(id: string): Observable<boolean> { return this.db.deleteSpecialite(id); }
}