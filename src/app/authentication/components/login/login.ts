import { Component, OnInit } from '@angular/core';
import { LogoComponent } from '../../../shared/logo-component/logo-component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/button-component/button-component';
import { toast } from 'ngx-sonner';
import { AuthenticationService } from '../../services/authentication-service';
import { MenuService } from '../../../core/services/menu-service';

@Component({
  selector: 'app-login',
  imports: [LogoComponent, ButtonComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  formGroup: FormGroup;
  loading: boolean = false;
  showPasswordLogin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: AuthenticationService,
    private router: Router,
    private menuService: MenuService
  ) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async login() {
    this.loading = true;
    const { email, password } = this.formGroup.value;

    (await this.service.login(email, password)).subscribe({
      next: () => {
        toast.success('Connexion réussie');

        // Reset form after successful login
        this.formGroup.reset();
        this.loading = false;

        const roles = this.service.getUserRole();
        this.menuService.setRoles(roles);
        const menu = this.menuService.getMenu();

        let target = '/dashboard/';
        if (menu && menu.length) {
          const first = menu[0];
          target = first.children && first.children.length
            ? first.children[0].route
            : first.route;
        }

        this.router.navigate([target]);
      },
      error: (error) => {
        toast.error(error);
        this.loading = false;
      },
    });
  }

  toggleShowPasswordLogin() {
    this.showPasswordLogin = !this.showPasswordLogin;
  }
}
