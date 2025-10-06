import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api';

export interface UserAccountItem {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  username: string;
  telephone: string;
  statut: string;
  enable: boolean;
  role: string;
  roles: string;
  dateCreation: string;
  createdAt: Date;
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
  enable?: boolean;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl = `${API_BASE_URL}/users`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserAccountItem[]> {
    return this.http.get<UserAccountItem[]>(this.baseUrl);
  }

  create(payload: CreateUserPayload): Observable<UserAccountItem> {
    return this.http.post<UserAccountItem>(this.baseUrl, {
      username: payload.email,
      fullName: 'User',
      password: payload.password,
      roles: payload.role,
      enable: true,
      // publicId: uuidv4(),
      createdAt: new Date(),
    });
  }

  update(id: string, changes: UpdateUserPayload): Observable<UserAccountItem> {
    return this.http.put<UserAccountItem>(`${this.baseUrl}/${id}`, {
      fullName: 'User',
      username: changes.email,
      roles: changes.role,
      password: '',
      enable: changes.enable ?? false,
      // publicId: uuidv4(),
      createdAt: new Date(),
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  resetPassword(
    id: number,
    publicId: string,
    currentPassword: string,
    newPassword: string
  ): Observable<{ message: string }> {
    console.log(currentPassword, newPassword);

    return this.http.put<{ message: string }>(`${this.baseUrl}/change_password/${publicId}`, {
      currentPassword,
      newPassword,
      userId: id,
    });
  }

  getRoles(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${API_BASE_URL}/role`);
  }
}
