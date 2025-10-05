import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-analyses-edit-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Éditer une analyse</h2>
        <span class="text-xs text-gray-500">ID: {{ id }}</span>
      </div>
      <div class="bg-white border border-neutral-300 rounded p-6">
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
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
export class AnalysesEditAdminComponent {
  id: string | null;
  form: FormGroup;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.id = this.route.snapshot.paramMap.get('id');
    // Valeurs initiales placeholder pour la démo
    this.form = this.fb.group({
      libelle: ['Hémogramme', Validators.required],
      cout: [15000, [Validators.required, Validators.min(0)]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    // TODO: mettre à jour via service
    this.router.navigate(['/dashboard/admin/analyses/list']);
  }

  cancel() { this.router.navigate(['/dashboard/admin/analyses/list']); }
}