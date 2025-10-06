import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Role } from '../../core/interfaces/role-type';
import { API_BASE_URL } from '../../core/services/api';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  roles: Role[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly baseUrl = `${API_BASE_URL}`;

  constructor(private http: HttpClient) {}

  async login(
    email: string,
    password: string
  ): Promise<Observable<{ accessToken: string; id: string; username: string; roles: string[] }>> {
    const obs = this.http
      .post<{ accessToken: string; id: string; username: string; roles: string[] }>(
        `${this.baseUrl}/login`,
        { username: email, password }
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem(
            'user_info',
            JSON.stringify({
              id: response.id,
              email: response.username,
              roles: response.roles
                .map((role) => role.replace('ROLE_', ''))
                .map((role) => role.toLowerCase() as Role),
            })
          );
        })
      );
    return Promise.resolve(obs);
  }

  async forgotPassword(email: string): Promise<Observable<{ message: string }>> {
    return Promise.resolve(
      this.http.post<{ message: string }>(`${this.baseUrl}/forgot-password`, { email })
    );
  }

  async resetPassword(
    email: string,
    password: string,
    otp: string
  ): Promise<Observable<{ message: string }>> {
    return Promise.resolve(
      this.http.post<{ message: string }>(`${this.baseUrl}/reset-password`, {
        email,
        password,
        otp,
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  getUserRole(): Role[] {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo) as UserInfo;
      return user.roles;
    }
    return ['doctor'] as Role[];
  }

  getCurrentUser(): UserInfo | null {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      return JSON.parse(userInfo) as UserInfo;
    }
    return null;
  }

  // Expose all users (sans mot de passe) pour alimenter des sélecteurs
  getAllUsers(): Observable<Array<{ id: string; email: string; name: string; role: Role }>> {
    return this.http.get<Array<{ id: string; email: string; name: string; role: Role }>>(
      `${this.baseUrl}/users`
    );
  }
}
