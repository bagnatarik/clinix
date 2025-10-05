import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-rdv-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
      <div class="bg-white border border-neutral-300 rounded p-6">
        <h2 class="text-xl font-bold text-gray-800">Prendre un rendez-vous</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Motif</label>
            <input type="text" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="motif" placeholder="Ex: Consultation générale" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input type="date" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="date" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Heure</label>
            <input type="time" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="heure" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Médecin</label>
            <input type="text" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="medecin" placeholder="Nom du médecin" />
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button type="submit" class="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer text-sm" [disabled]="form.invalid">Enregistrer</button>
        <a class="px-5 py-2.5 border border-gray-600 text-gray-600 rounded hover:bg-gray-600 hover:text-white transition hover:cursor-pointer text-sm" [routerLink]="['/patient/rdv/list']">Annuler</a>
      </div>
    </form>
  `,
})
export class RdvNew {
  form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      motif: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      medecin: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.router.navigate(['/patient/rdv/list']);
  }
}