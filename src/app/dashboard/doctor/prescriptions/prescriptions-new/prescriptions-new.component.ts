import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PrescriptionsService } from '../prescriptions.service';
import { Prescription } from '../../../../core/interfaces/medical';

@Component({
  selector: 'app-prescriptions-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './prescriptions-new.component.html',
  styleUrl: './prescriptions-new.component.css',
})
export class PrescriptionsNewComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private service: PrescriptionsService, private router: Router) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: ['', Validators.required],
      details: ['', Validators.required],
      statut: ['brouillon', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const { patient, date, details, statut } = this.form.value;
    this.service
      .create({ patient: patient!, date: date!, details: details!, statut: statut! as any })
      .subscribe(() => this.router.navigate(['/dashboard/doctor/prescriptions/list']));
  }
}