import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hospitalisation } from '../../../core/interfaces/medical';
import { InMemoryDatabaseService } from '../../../core/services/in-memory-database.service';

@Injectable({ providedIn: 'root' })
export class HospitalisationsService {
  constructor(private db: InMemoryDatabaseService) {}

  getAll(): Observable<Hospitalisation[]> { return this.db.getHospitalisations(); }
  create(item: Omit<Hospitalisation, 'id'>): Observable<Hospitalisation> { return this.db.createHospitalisation(item); }
  update(id: string, changes: Partial<Hospitalisation>): Observable<Hospitalisation | null> { return this.db.updateHospitalisation(id, changes); }
  delete(id: string): Observable<boolean> { return this.db.deleteHospitalisation(id); }
}