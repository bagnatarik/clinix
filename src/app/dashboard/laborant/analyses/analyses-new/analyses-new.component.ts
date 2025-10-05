import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analyses-new-laborant',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
      <div class="bg-white border border-neutral-300 rounded p-6">
        <h2 class="text-xl font-bold text-gray-800">Nouvelle analyse</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Patient</label>
            <input type="text" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="patient" placeholder="Nom du patient" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Type d'analyse</label>
            <input type="text" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="type" placeholder="Ex: Hémogramme" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date de prélèvement</label>
            <input type="date" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="datePrelevement" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1">Résultats (notes)</label>
            <textarea rows="4" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="resultats" placeholder="Saisir les observations et résultats"></textarea>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button type="submit" class="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer text-sm" [disabled]="form.invalid">Enregistrer</button>
        <a class="px-5 py-2.5 border border-gray-600 text-gray-600 rounded hover:bg-gray-600 hover:text-white transition hover:cursor-pointer text-sm" [routerLink]="['/dashboard/laborant/analyses/list']">Annuler</a>
      </div>
    </form>
  `,
})
export class AnalysesNewLaborantComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      type: ['', Validators.required],
      datePrelevement: ['', Validators.required],
      resultats: [''],
    });
  }

  submit() {
    if (this.form.invalid) return;
    // Placeholder submit
    this.router.navigate(['/dashboard/laborant/analyses/list']);
  }
}