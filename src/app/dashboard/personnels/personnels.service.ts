import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Personnel, PersonnelRequest } from '../../core/interfaces/admin';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/services/api';

@Injectable({ providedIn: 'root' })
export class PersonnelsService {
  private readonly baseUrl = `${API_BASE_URL}/personnel`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.baseUrl + '/all');
  }
  create(item: PersonnelRequest): Observable<Personnel> {
    return this.http.post<Personnel>(this.baseUrl + '/save', item);
  }
  update(id: string, changes: Partial<PersonnelRequest>): Observable<Personnel | null> {
    return this.http.put<Personnel | null>(`${this.baseUrl}/update/${id}`, { ...changes });
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
