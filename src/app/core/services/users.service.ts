import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api';

export interface UserAccountItem {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  statut: string;
  dateCreation: string;
  sexe: string;
  adresse: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  sexe: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  role: string;
}

export interface UpdateUserPayload {
  email: string;
  sexe: string;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl = `${API_BASE_URL}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserAccountItem[]> {
    return this.http.get<UserAccountItem[]>(this.baseUrl);
  }

  create(payload: CreateUserPayload): Observable<UserAccountItem> {
    return this.http.post<UserAccountItem>(this.baseUrl, payload);
  }

  update(id: string, changes: UpdateUserPayload): Observable<UserAccountItem> {
    return this.http.put<UserAccountItem>(`${this.baseUrl}/${id}`, changes);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  resetPassword(id: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${id}/reset-password`, {
      password: newPassword,
    });
  }
}