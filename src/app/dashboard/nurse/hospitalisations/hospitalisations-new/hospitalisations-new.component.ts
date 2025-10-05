import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-hospitalisations-new-nurse',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
      <div class="bg-white border border-neutral-300 rounded p-6">
        <h2 class="text-xl font-bold text-gray-800">Nouvelle hospitalisation</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date d'admission</label>
            <input
              type="date"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              formControlName="dateAdmission"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date de sortie</label>
            <input
              type="date"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              formControlName="dateSortie"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1">Motif</label>
            <textarea
              rows="3"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              formControlName="motif"
              placeholder="Motif d'hospitalisation"
            ></textarea>
          </div>

          <!-- Sélecteur Diagnostique (dropdown avec recherche) -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 mb-1">Diagnostique</label>
            <button
              #diagnostiqueTrigger
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="toggleDiagnostiqueDropdown()"
              [attr.aria-expanded]="diagnostiqueDropdownOpen"
            >
              <span>{{ form.value.diagnostique || 'Sélectionner un diagnostique' }}</span>
              <svg
                class="size-4 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            @if (diagnostiqueDropdownOpen) {
            <div
              #diagnostiqueMenu
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                #diagnostiqueSearchInput
                [(ngModel)]="diagnostiqueSearch"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Rechercher un diagnostique..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (keydown.enter)="$event.preventDefault()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let d of filteredDiagnostiques; let i = index"
                  (mouseenter)="diagnostiqueActiveIndex = i"
                  [class.bg-blue-50]="
                    diagnostiqueActiveIndex === i || form.get('diagnostique')?.value === d
                  "
                  (click)="selectDiagnostique(d)"
                >
                  {{ d }}
                </button>
                <div
                  *ngIf="filteredDiagnostiques.length === 0"
                  class="px-3 py-2 text-xs text-neutral-500"
                >
                  Aucun diagnostique trouvé
                </div>
              </div>
            </div>
            }
          </div>

          <!-- Sélecteur Chambre (dropdown avec recherche) -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 mb-1">Chambre</label>
            <button
              #chambreTrigger
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="toggleChambreDropdown()"
              [attr.aria-expanded]="chambreDropdownOpen"
            >
              <span>{{ form.value.chambre || 'Sélectionner une chambre' }}</span>
              <svg
                class="size-4 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            @if (chambreDropdownOpen) {
            <div
              #chambreMenu
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                #chambreSearchInput
                [(ngModel)]="chambreSearch"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Rechercher une chambre..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (keydown.enter)="$event.preventDefault()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let r of filteredChambres; let i = index"
                  (mouseenter)="chambreActiveIndex = i"
                  [class.bg-blue-50]="chambreActiveIndex === i || form.get('chambre')?.value === r"
                  (click)="selectChambre(r)"
                >
                  {{ r }}
                </button>
                <div
                  *ngIf="filteredChambres.length === 0"
                  class="px-3 py-2 text-xs text-neutral-500"
                >
                  Aucune chambre disponible
                </div>
              </div>
            </div>
            }
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          class="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer text-sm"
          [disabled]="form.invalid"
        >
          Enregistrer
        </button>
        <a
          class="px-5 py-2.5 border border-gray-600 text-gray-600 rounded hover:bg-gray-600 hover:text-white transition hover:cursor-pointer text-sm"
          [routerLink]="['/dashboard/infirmier/hospitalisations/list']"
          >Annuler</a
        >
      </div>
    </form>
  `,
})
export class HospitalisationsNewNurseComponent {
  form: FormGroup;

  // Diagnostiques dropdown state
  diagnostiques: string[] = [
    'Infection respiratoire',
    'Hypertension',
    'Diabète',
    'Fracture',
    'Observation post-opératoire',
  ];
  diagnostiqueSearch: string = '';
  diagnostiqueDropdownOpen = false;
  diagnostiqueActiveIndex: number = -1;
  @ViewChild('diagnostiqueSearchInput') diagnostiqueSearchRef?: ElementRef<HTMLInputElement>;

  // Chambres dropdown state
  chambres: string[] = ['A-101', 'A-102', 'B-201', 'B-202', 'C-301'];
  chambreSearch: string = '';
  chambreDropdownOpen = false;
  chambreActiveIndex: number = -1;
  @ViewChild('chambreSearchInput') chambreSearchRef?: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      dateAdmission: [this.today(), Validators.required],
      dateSortie: ['', Validators.required],
      motif: ['', Validators.required],
      diagnostique: ['', Validators.required],
      chambre: ['', Validators.required],
    });
  }

  private today(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Diagnostiques dropdown helpers
  get filteredDiagnostiques(): string[] {
    const q = this.diagnostiqueSearch.trim().toLowerCase();
    if (!q) return this.diagnostiques;
    return this.diagnostiques.filter((d) => d.toLowerCase().includes(q));
  }
  toggleDiagnostiqueDropdown() {
    this.diagnostiqueDropdownOpen = !this.diagnostiqueDropdownOpen;
    if (this.diagnostiqueDropdownOpen) {
      const list = this.filteredDiagnostiques;
      const current = (this.form.get('diagnostique')?.value as string) || '';
      const idx = list.findIndex((d) => d === current);
      this.diagnostiqueActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => {
        this.diagnostiqueSearchRef?.nativeElement.focus();
      }, 0);
    }
  }
  selectDiagnostique(label: string) {
    this.form.get('diagnostique')?.setValue(label, { emitEvent: true });
    this.diagnostiqueDropdownOpen = false;
  }

  // Chambres dropdown helpers
  get filteredChambres(): string[] {
    const q = this.chambreSearch.trim().toLowerCase();
    if (!q) return this.chambres;
    return this.chambres.filter((r) => r.toLowerCase().includes(q));
  }
  toggleChambreDropdown() {
    this.chambreDropdownOpen = !this.chambreDropdownOpen;
    if (this.chambreDropdownOpen) {
      const list = this.filteredChambres;
      const current = (this.form.get('chambre')?.value as string) || '';
      const idx = list.findIndex((r) => r === current);
      this.chambreActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => {
        this.chambreSearchRef?.nativeElement.focus();
      }, 0);
    }
  }
  selectChambre(label: string) {
    this.form.get('chambre')?.setValue(label, { emitEvent: true });
    this.chambreDropdownOpen = false;
  }

  submit() {
    if (this.form.invalid) return;
    this.router.navigate(['/dashboard/infirmier/hospitalisations/list']);
  }
}
