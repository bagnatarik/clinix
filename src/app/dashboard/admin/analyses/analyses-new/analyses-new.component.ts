import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-analyses-new-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl space-y-6">
      <div class="bg-white border border-neutral-300 rounded p-6">
        <h2 class="text-xl font-bold text-gray-800">Créer une analyse</h2>
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Libellé <span class="text-red-600">*</span></label>
            <input type="text" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="libelle" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Coût <span class="text-red-600">*</span></label>
            <input type="number" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="cout" />
          </div>
          <div class="flex gap-2 pt-2">
            <button type="submit" [disabled]="form.invalid" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Enregistrer</button>
            <button type="button" class="px-4 py-2 border border-neutral-300 rounded text-sm" (click)="cancel()">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AnalysesNewAdminComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      libelle: ['', Validators.required],
      cout: [null, [Validators.required, Validators.min(0)]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    // TODO: envoyer au service
    this.router.navigate(['/dashboard/admin/analyses/list']);
  }

  cancel() { this.router.navigate(['/dashboard/admin/analyses/list']); }
}