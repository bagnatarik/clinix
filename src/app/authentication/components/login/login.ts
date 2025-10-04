import { Component, OnInit } from '@angular/core';
import { LogoComponent } from '../../../shared/logo-component/logo-component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/button-component/button-component';
import { toast } from 'ngx-sonner';
import { AuthenticationService } from '../../services/authentication-service';

@Component({
  selector: 'app-login',
  imports: [LogoComponent, ButtonComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  formGroup: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: AuthenticationService,
    private router: Router
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
      next: (response) => {
        toast.success('Connexion réussie');
        // Store token and role in local storage or session storage
        localStorage.setItem('token', response.token);

        // Reset form after successful login
        this.formGroup.reset();
        this.loading = false;

        this.router.navigate(['/dashboard/home']);
      },
      error: (error) => {
        toast.error(error);
        this.loading = false;
      },
    });
  }
}
