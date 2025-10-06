import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { CommonModule } from '@angular/common';
import { Role } from '../../core/interfaces/role-type';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  userName: string | null = null;
  userEmail: string | null = null;
  userRole: Role | null = null;
  dropdownOpen = false;

  @ViewChild('profileMenu') profileMenuRef?: ElementRef<HTMLDivElement>;
  @ViewChild('profileTrigger') profileTriggerRef?: ElementRef<HTMLButtonElement>;

  constructor(private auth: AuthenticationService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/authentication']);
  }

  ngOnInit() {
    const user = this.auth.getCurrentUser();
    this.userName = user?.name ?? null;
    this.userEmail = user?.email ?? null;
    this.userRole = user?.roles[0] ?? null;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  goToProfile() {
    // Redirection simple (remplacer par une route profil dédiée si disponible)
    this.router.navigate(['/dashboard/home']);
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Node;
    const menuEl = this.profileMenuRef?.nativeElement;
    const triggerEl = this.profileTriggerRef?.nativeElement;
    if (!menuEl || !triggerEl) return;
    if (!menuEl.contains(target) && !triggerEl.contains(target)) {
      this.dropdownOpen = false;
    }
  }

  getRoleFrench(role: Role | null): string {
    if (!role) return '';
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'doctor':
        return 'Médecin';
      case 'nurse':
        return 'Infirmier/Infirmière';
      case 'patient':
        return 'Patient';
      case 'laborant':
        return 'Laborantin';
      default:
        return role;
    }
  }
}
