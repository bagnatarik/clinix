import { Component, OnInit } from '@angular/core';
import { LogoComponent } from '../../../shared/logo-component/logo-component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/button-component/button-component';
import { toast } from 'ngx-sonner';
import { AuthenticationService } from '../../services/authentication-service';

@Component({
  selector: 'app-forgot-password',
  imports: [LogoComponent, ButtonComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnInit {
  formGroup: FormGroup;
  loading: boolean = false;
  client: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: AuthenticationService
  ) {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.client = params.get('client') === 'true';
    });
  }

  async send() {
    this.loading = true;
    const { email } = this.formGroup.value;
    (await this.service.forgotPassword(email)).subscribe({
      next: (res) => {
        toast.success(res.message);
        this.formGroup.reset();
        this.loading = false;
        localStorage.setItem('reset-password-email', email);
        this.router.navigate(['/authentication/reset-password'], {
          queryParams: {
            client: this.client,
          },
        });
      },
      error: (err) => {
        toast.error(err);
        this.loading = false;
      },
    });
  }
}
