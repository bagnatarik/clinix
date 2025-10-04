import { Component, OnInit } from '@angular/core';
import { LogoComponent } from '../../../shared/logo-component/logo-component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/button-component/button-component';
import { toast } from 'ngx-sonner';
import { AuthenticationService } from '../../services/authentication-service';
import { OneTimePasswordComponent } from '../../../shared/one-time-password-component/one-time-password-component';
@Component({
  selector: 'app-reset-password',
  imports: [
    LogoComponent,
    ButtonComponent,
    ReactiveFormsModule,
    RouterModule,
    OneTimePasswordComponent,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  formGroup: FormGroup;
  loading: boolean = false;
  client: boolean = true;

  email: string = localStorage.getItem('reset-password-email') || '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: AuthenticationService
  ) {
    this.formGroup = this.fb.group({
      email: [this.email, [Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.client = params['client'] === 'true';
    });

    if (this.email === '') {
      if (this.client) {
        this.router.navigate(['/authentication/login']);
      }
      this.router.navigate(['/authentication/login/professional']);
    }
  }

  async change() {
    this.loading = true;
    const { email, password, otp } = this.formGroup.value;

    (await this.service.resetPassword(email, password, otp)).subscribe({
      next: (res) => {
        toast.success(res.message);
        this.formGroup.reset();
        this.loading = false;
        localStorage.removeItem('reset-password-email');
        if (this.client) {
          this.router.navigate(['/authentication/login']);
        } else {
          this.router.navigate(['/authentication/login/professional']);
        }
      },
      error: (err) => {
        toast.error(err);
        this.loading = false;
      },
    });
  }
}
