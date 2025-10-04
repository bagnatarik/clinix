import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profession } from '../../core/interfaces/admin';
import { InMemoryDatabaseService } from '../../core/services/in-memory-database.service';
import { AuthenticationService } from '../../authentication/services/authentication-service';

@Injectable({ providedIn: 'root' })
export class ProfessionsService {
  constructor(private db: InMemoryDatabaseService, private auth: AuthenticationService) {}

  getAll(): Observable<Profession[]> { return this.db.getProfessions(); }
  create(item: Omit<Profession, 'id' | 'updatedBy'> & { id?: string }): Observable<Profession> {
    const user = this.auth.getCurrentUser();
    return this.db.createProfession({ ...item, updatedBy: user?.name });
  }
  update(id: string, changes: Partial<Profession>): Observable<Profession | null> {
    const user = this.auth.getCurrentUser();
    return this.db.updateProfession(id, { ...changes, updatedBy: user?.name });
  }
  delete(id: string): Observable<boolean> { return this.db.deleteProfession(id); }
}