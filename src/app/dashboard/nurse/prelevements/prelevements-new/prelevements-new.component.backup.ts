import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prelevements-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
      <div class="bg-white border border-neutral-300 rounded p-6">
        <h2 class="text-xl font-bold text-gray-800">Nouveau prélèvement</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 mb-1">Patient</label>
            <button
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="togglePatientDropdown()"
              [attr.aria-expanded]="patientDropdownOpen"
            >
              <span>{{ form.value.patient || 'Sélectionner un patient' }}</span>
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

            <div
              *ngIf="patientDropdownOpen"
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                #patientSearchInput
                [(ngModel)]="patientSearch"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Rechercher un patient..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (keydown.enter)="$event.preventDefault()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let p of filteredPatients; let i = index"
                  (mouseenter)="activeIndex = i"
                  [class.bg-blue-50]="activeIndex === i || form.get('patient')?.value === p"
                  (click)="selectPatientName(p)"
                >
                  {{ p }}
                </button>

                <div *ngIf="filteredPatients.length === 0" class="px-3 py-2 text-xs text-neutral-500">
                  Aucun patient trouvé
                </div>
              </div>
            </div>
          </div>

          <!-- Consultation (conditionnel: affiché uniquement si patient sélectionné) -->
          <div class="relative" *ngIf="form.value.patient">
            <label class="block text-xs font-medium text-gray-500 mb-1">Consultation</label>
            <button
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="toggleConsultationDropdown()"
              [attr.aria-expanded]="consultationDropdownOpen"
            >
              <span>{{ form.value.consultation || 'Sélectionner une consultation' }}</span>
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

            <div
              *ngIf="consultationDropdownOpen"
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                #consultationSearchInput
                [(ngModel)]="consultationSearch"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Rechercher une consultation..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (keydown.enter)="$event.preventDefault()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let c of filteredConsultations; let i = index"
                  (mouseenter)="consultationActiveIndex = i"
                  [class.bg-blue-50]="consultationActiveIndex === i || form.get('consultation')?.value === c"
                  (click)="selectConsultation(c)"
                >
                  {{ c }}
                </button>

                <div *ngIf="filteredConsultations.length === 0" class="px-3 py-2 text-xs text-neutral-500">
                  Aucune consultation disponible
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Type de prélèvement</label>
            <select class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="type">
              <option value="" disabled>Choisir un type...</option>
              <option value="sanguin">Sanguin</option>
              <option value="urinaire">Urinaire</option>
              <option value="salivaire">Salivaire</option>
              <option value="fécal">Fécal</option>
              <option value="tissulaire">Tissulaire</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input type="date" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="date" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Statut</label>
            <select class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="statut">
              <option value="en attente">En attente</option>
              <option value="effectué">Effectué</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button type="submit" class="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer text-sm" [disabled]="form.invalid">Enregistrer</button>
        <a class="px-5 py-2.5 border border-gray-600 text-gray-600 rounded hover:bg-gray-600 hover:text-white transition hover:cursor-pointer text-sm" [routerLink]="['/dashboard/infirmier/prelevements/list']">Annuler</a>
      </div>
    </form>
  `,
})
export class PrelevementsNewComponent {
  form: FormGroup;
  // Dropdown patient façon Consultations/Ordonnances
  patients: string[] = ['Alice Dubois', 'Jean Dupont', 'Sophie Martin', 'Paul Bernard'];
  patientSearch: string = '';
  patientDropdownOpen = false;
  activeIndex: number = -1;
  @ViewChild('patientSearchInput') patientSearchRef?: ElementRef<HTMLInputElement>;
  // Consultation selector
  consultationsByPatient: Record<string, string[]> = {
    'Alice Dubois': ['CONS-2025-001 — 2025-10-01 — Suivi général', 'CONS-2025-006 — 2025-10-03 — Douleur tête'],
    'Jean Dupont': ['CONS-2025-002 — 2025-09-28 — Contrôle tension'],
    'Sophie Martin': ['CONS-2025-003 — 2025-10-02 — Fièvre'],
    'Paul Bernard': ['CONS-2025-004 — 2025-09-30 — Bilan annuel'],
  };
  consultationSearch: string = '';
  consultationDropdownOpen = false;
  consultationActiveIndex: number = -1;
  @ViewChild('consultationSearchInput') consultationSearchRef?: ElementRef<HTMLInputElement>;
  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      consultation: [''],
      type: ['', Validators.required],
      date: [this.today(), Validators.required],
      statut: ['en attente', Validators.required],
    });
  }

  private today(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Dropdown Consultations-like
  get filteredPatients(): string[] {
    const q = this.patientSearch.trim().toLowerCase();
    if (!q) return this.patients;
    return this.patients.filter((p) => p.toLowerCase().includes(q));
  }

  togglePatientDropdown() {
    this.patientDropdownOpen = !this.patientDropdownOpen;
    if (this.patientDropdownOpen) {
      const list = this.filteredPatients;
      const current = (this.form.get('patient')?.value as string) || '';
      const idx = list.findIndex((p) => p === current);
      this.activeIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      // Focaliser la recherche après affichage de la liste
      setTimeout(() => {
        this.patientSearchRef?.nativeElement.focus();
      }, 0);
    }
  }

  selectPatientName(name: string) {
    this.form.get('patient')?.setValue(name, { emitEvent: true });
    this.patientDropdownOpen = false;
  }

  // Consultations selector logic
  get availableConsultations(): string[] {
    const p = (this.form.get('patient')?.value as string) || '';
    return this.consultationsByPatient[p] || [];
  }

  get filteredConsultations(): string[] {
    const q = this.consultationSearch.trim().toLowerCase();
    const list = this.availableConsultations;
    if (!q) return list;
    return list.filter((c) => c.toLowerCase().includes(q));
  }

  toggleConsultationDropdown() {
    this.consultationDropdownOpen = !this.consultationDropdownOpen;
    if (this.consultationDropdownOpen) {
      const list = this.filteredConsultations;
      const current = (this.form.get('consultation')?.value as string) || '';
      const idx = list.findIndex((c) => c === current);
      this.consultationActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => {
        this.consultationSearchRef?.nativeElement.focus();
      }, 0);
    }
  }

  selectConsultation(label: string) {
    this.form.get('consultation')?.setValue(label, { emitEvent: true });
    this.consultationDropdownOpen = false;
  }

  submit() {
    if (this.form.invalid) return;
    // Placeholder submit
    this.router.navigate(['/dashboard/infirmier/prelevements/list']);
  }
}