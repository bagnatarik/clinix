import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../authentication/services/authentication-service';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
  constructor(private auth: AuthenticationService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/authentication']);
  }
}
