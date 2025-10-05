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
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date de prélèvement</label>
            <input type="date" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="date" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Quantité prélevée</label>
            <input type="text" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" placeholder="ex: 5 ml" formControlName="quantite" />
          </div>

          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 mb-1">Type de prélèvement</label>
            <button
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="toggleTypeDropdown()"
              [attr.aria-expanded]="typeDropdownOpen"
            >
              <span>{{ form.value.type || 'Sélectionner un type' }}</span>
              <svg class="size-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div
              *ngIf="typeDropdownOpen"
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                #typeSearchInput
                [(ngModel)]="typeSearch"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Rechercher un type..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (keydown.enter)="$event.preventDefault()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let t of filteredTypes; let i = index"
                  (mouseenter)="typeActiveIndex = i"
                  [class.bg-blue-50]="typeActiveIndex === i || form.get('type')?.value === t"
                  (click)="selectType(t)"
                >
                  {{ t }}
                </button>

                <div *ngIf="filteredTypes.length === 0" class="px-3 py-2 text-xs text-neutral-500">
                  Aucun type trouvé
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 mb-1">Analyse médicale</label>
            <button
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="toggleAnalyseDropdown()"
              [attr.aria-expanded]="analyseDropdownOpen"
            >
              <span>{{ form.value.analyse || 'Sélectionner une analyse' }}</span>
              <svg class="size-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div
              *ngIf="analyseDropdownOpen"
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                #analyseSearchInput
                [(ngModel)]="analyseSearch"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Rechercher une analyse..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (keydown.enter)="$event.preventDefault()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let a of filteredAnalyses; let i = index"
                  (mouseenter)="analyseActiveIndex = i"
                  [class.bg-blue-50]="analyseActiveIndex === i || form.get('analyse')?.value === a"
                  (click)="selectAnalyse(a)"
                >
                  {{ a }}
                </button>

                <div *ngIf="filteredAnalyses.length === 0" class="px-3 py-2 text-xs text-neutral-500">
                  Aucune analyse trouvée
                </div>
              </div>
            </div>
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

  // Types de prélèvements
  typesPrelevement: string[] = ['Sanguin', 'Urinaire', 'Salivaire', 'Fécal', 'Tissulaire'];
  typeSearch: string = '';
  typeDropdownOpen = false;
  typeActiveIndex: number = -1;
  @ViewChild('typeSearchInput') typeSearchRef?: ElementRef<HTMLInputElement>;

  // Analyses médicales
  analysesMedicales: string[] = ['Hémogramme', 'Glycémie', 'Bilan rénal', 'Culture bactériologique', 'Hormones', 'Marqueurs tumoraux', 'PCR'];
  analyseSearch: string = '';
  analyseDropdownOpen = false;
  analyseActiveIndex: number = -1;
  @ViewChild('analyseSearchInput') analyseSearchRef?: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      date: [this.today(), Validators.required],
      quantite: ['', Validators.required],
      type: ['', Validators.required],
      analyse: ['', Validators.required],
    });
  }

  private today(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Dropdown type
  get filteredTypes(): string[] {
    const q = this.typeSearch.trim().toLowerCase();
    if (!q) return this.typesPrelevement;
    return this.typesPrelevement.filter((t) => t.toLowerCase().includes(q));
  }

  toggleTypeDropdown() {
    this.typeDropdownOpen = !this.typeDropdownOpen;
    if (this.typeDropdownOpen) {
      const list = this.filteredTypes;
      const current = (this.form.get('type')?.value as string) || '';
      const idx = list.findIndex((t) => t === current);
      this.typeActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => {
        this.typeSearchRef?.nativeElement.focus();
      }, 0);
    }
  }

  selectType(type: string) {
    this.form.get('type')?.setValue(type, { emitEvent: true });
    this.typeDropdownOpen = false;
  }

  // Dropdown analyse
  get filteredAnalyses(): string[] {
    const q = this.analyseSearch.trim().toLowerCase();
    if (!q) return this.analysesMedicales;
    return this.analysesMedicales.filter((a) => a.toLowerCase().includes(q));
  }

  toggleAnalyseDropdown() {
    this.analyseDropdownOpen = !this.analyseDropdownOpen;
    if (this.analyseDropdownOpen) {
      const list = this.filteredAnalyses;
      const current = (this.form.get('analyse')?.value as string) || '';
      const idx = list.findIndex((a) => a === current);
      this.analyseActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => {
        this.analyseSearchRef?.nativeElement.focus();
      }, 0);
    }
  }

  selectAnalyse(analyse: string) {
    this.form.get('analyse')?.setValue(analyse, { emitEvent: true });
    this.analyseDropdownOpen = false;
  }

  submit() {
    if (this.form.invalid) return;
    // Placeholder submit
    this.router.navigate(['/dashboard/infirmier/prelevements/list']);
  }
}