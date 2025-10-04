import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HospitalisationsService } from '../hospitalisations.service';
import { Hospitalisation } from '../../../../core/interfaces/medical';

@Component({
  selector: 'app-hospitalisations-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './hospitalisations-new.component.html',
  styleUrl: './hospitalisations-new.component.css',
})
export class HospitalisationsNewComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private service: HospitalisationsService, private router: Router) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      admissionDate: ['', Validators.required],
      service: ['', Validators.required],
      statut: ['en cours', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const { patient, admissionDate, service, statut } = this.form.value;
    this.service
      .create({ patient: patient!, admissionDate: admissionDate!, service: service!, statut: statut! as any })
      .subscribe(() => this.router.navigate(['/dashboard/doctor/hospitalisations/list']));
  }
}