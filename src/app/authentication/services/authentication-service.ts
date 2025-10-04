import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from '../../core/interfaces/role-type';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: Role;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // Utilisateurs fictifs pour simuler différents rôles
  private mockUsers = [
    {
      id: '1',
      email: 'admin@clinix.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin' as Role,
    },
    {
      id: '2',
      email: 'doctor@clinix.com',
      password: 'doctor123',
      name: 'Doctor User',
      role: 'doctor' as Role,
    },
    {
      id: '3',
      email: 'patient@clinix.com',
      password: 'patient123',
      name: 'Patient User',
      role: 'patient' as Role,
    },
    {
      id: '4',
      email: 'tarikbagnapro@gmail.com',
      password: 'azertyuiop',
      name: 'Tarik Bagna',
      role: 'admin' as Role,
    },
  ];

  async login(
    email: string,
    password: string
  ): Promise<Observable<{ token: string; user: UserInfo }>> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = this.mockUsers.find((u) => u.email === email && u.password === password);

    if (user) {
      // Stocker les informations utilisateur dans localStorage
      const userInfo: UserInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (user.role as string).toLowerCase() as Role,
      };

      localStorage.setItem('token', 'jwt_token_' + user.id);
      localStorage.setItem('user_info', JSON.stringify(userInfo));

      return of({ token: 'jwt_token_' + user.id, user: userInfo });
    }

    return new Observable((observer) => observer.error('Invalid credentials'));
  }

  async forgotPassword(email: string): Promise<Observable<{ message: string }>> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (this.mockUsers.some((u) => u.email === email)) {
      return of({ message: 'Password reset email sent to ' + email });
    }
    return new Observable((observer) => observer.error('Email not found'));
  }

  async resetPassword(
    email: string,
    password: string,
    otp: string
  ): Promise<Observable<{ message: string }>> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (this.mockUsers.some((u) => u.email === email) && otp === '123456') {
      return of({ message: 'Password reset successfully' });
    }
    return new Observable((observer) => observer.error('Invalid OTP'));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  getUserRole(): Role {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo) as UserInfo;
      return (user.role as string).toLowerCase() as Role;
    }
    return 'doctor' as Role;
  }

  getCurrentUser(): UserInfo | null {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      return JSON.parse(userInfo) as UserInfo;
    }
    return null;
  }
}
