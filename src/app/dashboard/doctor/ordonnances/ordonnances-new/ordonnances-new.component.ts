import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrdonnancesService } from '../ordonnances.service';

@Component({
  selector: 'app-ordonnances-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './ordonnances-new.component.html',
})
export class OrdonnancesNewComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private service: OrdonnancesService, private router: Router) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: ['', Validators.required],
      contenu: ['', Validators.required],
      statut: ['brouillon', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const { patient, date, contenu, statut } = this.form.value;
    this.service
      .create({ patient: patient!, date: date!, contenu: contenu!, statut: statut! as any })
      .subscribe(() => this.router.navigate(['/dashboard/doctor/ordonnances/list']));
  }
}