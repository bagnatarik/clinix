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
  selector: 'app-rendezvous-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
      <div class="bg-white border border-neutral-300 rounded p-6">
        <h2 class="text-xl font-bold text-gray-800">Nouveau rendez-vous</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <!-- Patient selector with search -->
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

                <div
                  *ngIf="filteredPatients.length === 0"
                  class="px-3 py-2 text-xs text-neutral-500"
                >
                  Aucun patient trouvé
                </div>
              </div>
            </div>
          </div>

          <!-- Personnel selector with search -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 mb-1">Personnel</label>
            <button
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="togglePersonnelDropdown()"
              [attr.aria-expanded]="personnelDropdownOpen"
            >
              <span>{{ form.value.personnel || 'Sélectionner un personnel' }}</span>
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
              *ngIf="personnelDropdownOpen"
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                #personnelSearchInput
                [(ngModel)]="personnelSearch"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Rechercher un personnel..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (keydown.enter)="$event.preventDefault()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let s of filteredPersonnels; let i = index"
                  (mouseenter)="personnelActiveIndex = i"
                  [class.bg-blue-50]="
                    personnelActiveIndex === i || form.get('personnel')?.value === s
                  "
                  (click)="selectPersonnelName(s)"
                >
                  {{ s }}
                </button>

                <div
                  *ngIf="filteredPersonnels.length === 0"
                  class="px-3 py-2 text-xs text-neutral-500"
                >
                  Aucun personnel trouvé
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date de rendez-vous</label>
            <input
              type="date"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              formControlName="date"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Heure de rendez-vous</label>
            <input
              type="time"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              formControlName="heure"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1">Statut</label>
            <select
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              formControlName="statut"
            >
              <option value="planifié">Planifié</option>
              <option value="honoré">Honoré</option>
              <option value="annulé">Annulé</option>
            </select>
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
          [routerLink]="['/dashboard/infirmier/rendezvous/list']"
          >Annuler</a
        >
      </div>
    </form>
  `,
})
export class RendezvousNewComponent {
  form: FormGroup;

  patients: string[] = ['Alice Dubois', 'Jean Dupont', 'Sophie Martin', 'Paul Bernard'];
  patientSearch: string = '';
  patientDropdownOpen = false;
  activeIndex: number = -1;
  @ViewChild('patientSearchInput') patientSearchRef?: ElementRef<HTMLInputElement>;

  personnels: string[] = ['Tarik', 'Sarah', 'Karim'];
  personnelSearch: string = '';
  personnelDropdownOpen = false;
  personnelActiveIndex: number = -1;
  @ViewChild('personnelSearchInput') personnelSearchRef?: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      personnel: ['', Validators.required],
      date: [this.today(), Validators.required],
      heure: ['09:00', Validators.required],
      statut: ['planifié', Validators.required],
    });
  }

  private today(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

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
      setTimeout(() => {
        this.patientSearchRef?.nativeElement.focus();
      }, 0);
    }
  }

  selectPatientName(name: string) {
    this.form.get('patient')?.setValue(name, { emitEvent: true });
    this.patientDropdownOpen = false;
  }

  get filteredPersonnels(): string[] {
    const q = this.personnelSearch.trim().toLowerCase();
    if (!q) return this.personnels;
    return this.personnels.filter((s) => s.toLowerCase().includes(q));
  }

  togglePersonnelDropdown() {
    this.personnelDropdownOpen = !this.personnelDropdownOpen;
    if (this.personnelDropdownOpen) {
      const list = this.filteredPersonnels;
      const current = (this.form.get('personnel')?.value as string) || '';
      const idx = list.findIndex((s) => s === current);
      this.personnelActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => {
        this.personnelSearchRef?.nativeElement.focus();
      }, 0);
    }
  }

  selectPersonnelName(name: string) {
    this.form.get('personnel')?.setValue(name, { emitEvent: true });
    this.personnelDropdownOpen = false;
  }

  submit() {
    if (this.form.invalid) return;
    // Placeholder submit
    this.router.navigate(['/dashboard/infirmier/rendezvous/list']);
  }
}
