import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Personnel } from '../../core/interfaces/admin';
import { InMemoryDatabaseService } from '../../core/services/in-memory-database.service';
import { AuthenticationService } from '../../authentication/services/authentication-service';

@Injectable({ providedIn: 'root' })
export class PersonnelsService {
  constructor(private db: InMemoryDatabaseService, private auth: AuthenticationService) {}

  getAll(): Observable<Personnel[]> { return this.db.getPersonnels(); }
  create(item: Omit<Personnel, 'id' | 'updatedBy'> & { id?: string }): Observable<Personnel> {
    const user = this.auth.getCurrentUser();
    return this.db.createPersonnel({ ...item, updatedBy: user?.name });
  }
  update(id: string, changes: Partial<Personnel>): Observable<Personnel | null> {
    const user = this.auth.getCurrentUser();
    return this.db.updatePersonnel(id, { ...changes, updatedBy: user?.name });
  }
  delete(id: string): Observable<boolean> { return this.db.deletePersonnel(id); }
}