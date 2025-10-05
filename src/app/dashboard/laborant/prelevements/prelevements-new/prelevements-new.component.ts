import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prelevements-new-laborant',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="bg-white border border-neutral-200 rounded-lg shadow-sm">
        <div class="px-5 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-semibold text-gray-800">Nouveau prélèvement</h2>
          <p class="text-xs text-gray-500">Renseignez les informations du prélèvement effectué.</p>
        </div>
        <div class="p-5">
          <form [formGroup]="form" class="space-y-5" (ngSubmit)="submit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Patient <span class="text-red-600">*</span></label>
                <input formControlName="patient" class="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type de prélèvement <span class="text-red-600">*</span></label>
                <select formControlName="type" class="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Sanguin">Sanguin</option>
                  <option value="Urine">Urine</option>
                  <option value="Salive">Salive</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date <span class="text-red-600">*</span></label>
                <input type="date" formControlName="date" class="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Statut <span class="text-red-600">*</span></label>
                <select formControlName="statut" class="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="En attente">En attente</option>
                  <option value="Reçu">Reçu</option>
                </select>
              </div>
            </div>

            <div class="flex gap-3 justify-end pt-2">
              <button type="button" class="px-4 py-2 text-sm rounded-md border border-neutral-300 text-gray-700 hover:bg-gray-50" (click)="cancel()">Annuler</button>
              <button type="submit" [disabled]="form.invalid" class="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class PrelevementsNewLaborantComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      type: ['Sanguin', Validators.required],
      date: ['', Validators.required],
      statut: ['En attente', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    // TODO: brancher service d’enregistrement
    this.router.navigate(['/dashboard/laborant/prelevements/list']);
  }

  cancel() {
    this.router.navigate(['/dashboard/laborant/prelevements/list']);
  }
}