import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ConsultationsService } from '../consultations.service';
import { Consultation } from '../../../../core/interfaces/medical';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-consultations-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './consultations-new.component.html',
  styleUrl: './consultations-new.component.css',
})
export class ConsultationsNewComponent {
  doctorName: string;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ConsultationsService,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.doctorName = this.auth.getCurrentUser()?.name ?? 'Dr. Anne Mercier';
    this.form = this.fb.group({
      patient: ['Alice Dubois', Validators.required],
      date: ['2025-10-03', Validators.required],
      motif: [
        "Douleur abdominale depuis 2 jours, accompagnée de nausées et perte d'appétit.",
        Validators.required,
      ],
      statut: ['planifiée', Validators.required],
      notesSoap: [''],
      diagnostics: this.fb.array([]),
    });
  }

  get diagnostics(): FormArray {
    return this.form.get('diagnostics') as FormArray;
  }

  addDiagnostic(input?: HTMLInputElement) {
    const desc = (input?.value ?? '').trim();
    if (!desc) return;
    this.diagnostics.push(this.fb.group({ description: [desc, Validators.required] }));
    if (input) input.value = '';
  }

  removeDiagnostic(index: number) {
    if (index < 0 || index >= this.diagnostics.length) return;
    this.diagnostics.removeAt(index);
  }

  submit() {
    if (this.form.invalid) return;
    const { patient, date, motif, statut } = this.form.value as Consultation;
    this.service
      .create({ patient, date, motif, statut })
      .subscribe((created) => this.router.navigate(['/dashboard/doctor/consultations', created.id]));
  }
}
