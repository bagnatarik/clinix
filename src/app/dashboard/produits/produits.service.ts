import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produit } from '../../core/interfaces/admin';
import { InMemoryDatabaseService } from '../../core/services/in-memory-database.service';
import { AuthenticationService } from '../../authentication/services/authentication-service';

@Injectable({ providedIn: 'root' })
export class ProduitsService {
  constructor(private db: InMemoryDatabaseService, private auth: AuthenticationService) {}

  getAll(): Observable<Produit[]> { return this.db.getProduits(); }
  create(item: Omit<Produit, 'id' | 'updatedBy'> & { id?: string }): Observable<Produit> {
    const user = this.auth.getCurrentUser();
    return this.db.createProduit({ ...item, updatedBy: user?.name });
  }
  update(id: string, changes: Partial<Produit>): Observable<Produit | null> {
    const user = this.auth.getCurrentUser();
    return this.db.updateProduit(id, { ...changes, updatedBy: user?.name });
  }
  delete(id: string): Observable<boolean> { return this.db.deleteProduit(id); }
}