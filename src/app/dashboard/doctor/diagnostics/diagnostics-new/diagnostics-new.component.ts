import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DiagnosticsService } from '../diagnostics.service';
import { Diagnostic } from '../../../../core/interfaces/medical';

@Component({
  selector: 'app-diagnostics-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './diagnostics-new.component.html',
  styleUrl: './diagnostics-new.component.css',
})
export class DiagnosticsNewComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private service: DiagnosticsService, private router: Router) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: ['', Validators.required],
      resultat: ['', Validators.required],
      statut: ['en attente', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const { patient, date, resultat, statut } = this.form.value;
    this.service
      .create({ patient: patient!, date: date!, resultat: resultat!, statut: statut! as any })
      .subscribe(() => this.router.navigate(['/dashboard/doctor/diagnostics/list']));
  }
}