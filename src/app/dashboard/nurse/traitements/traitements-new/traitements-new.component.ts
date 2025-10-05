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
  selector: 'app-traitements-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
      <div class="bg-white border border-neutral-300 rounded p-6">
        <h2 class="text-xl font-bold text-gray-800">Ajouter un traitement</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date de début</label>
            <input
              type="date"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              formControlName="dateDebut"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date de fin</label>
            <input
              type="date"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm"
              formControlName="dateFin"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1">Dose journalière</label>
            <input
              type="text"
              class="w-full border border-neutral-300 placeholder:text-gray-600 rounded px-3 py-2 text-sm"
              formControlName="doseJournaliere"
              placeholder="Ex: 2 comprimés/jour"
            />
          </div>
          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea
              rows="3"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm placeholder:text-gray-600"
              formControlName="description"
              placeholder="Détails du traitement"
            ></textarea>
          </div>

          <!-- Sélecteur Hospitalisation -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 mb-1">Hospitalisation</label>
            <button
              #hospitalisationTrigger
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="toggleHospitalisationDropdown()"
              [attr.aria-expanded]="hospitalisationDropdownOpen"
            >
              <span>{{ form.value.hospitalisation || 'Sélectionner une hospitalisation' }}</span>
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

            @if (hospitalisationDropdownOpen) {
            <div
              #hospitalisationMenu
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                #hospitalisationSearchInput
                [(ngModel)]="hospitalisationSearch"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Rechercher une hospitalisation..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (keydown.enter)="$event.preventDefault()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let h of filteredHospitalisations; let i = index"
                  (mouseenter)="hospitalisationActiveIndex = i"
                  [class.bg-blue-50]="
                    hospitalisationActiveIndex === i || form.get('hospitalisation')?.value === h
                  "
                  (click)="selectHospitalisation(h)"
                >
                  {{ h }}
                </button>
                <div
                  *ngIf="filteredHospitalisations.length === 0"
                  class="px-3 py-2 text-xs text-neutral-500"
                >
                  Aucune hospitalisation trouvée
                </div>
              </div>
            </div>
            }
          </div>

          <!-- Sélecteur Produit -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 mb-1">Produit</label>
            <button
              #produitTrigger
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="toggleProduitDropdown()"
              [attr.aria-expanded]="produitDropdownOpen"
            >
              <span>{{ form.value.produit || 'Sélectionner un produit' }}</span>
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

            @if (produitDropdownOpen) {
            <div
              #produitMenu
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                #produitSearchInput
                [(ngModel)]="produitSearch"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Rechercher un produit..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (keydown.enter)="$event.preventDefault()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let p of filteredProduits; let i = index"
                  (mouseenter)="produitActiveIndex = i"
                  [class.bg-blue-50]="produitActiveIndex === i || form.get('produit')?.value === p"
                  (click)="selectProduit(p)"
                >
                  {{ p }}
                </button>
                <div
                  *ngIf="filteredProduits.length === 0"
                  class="px-3 py-2 text-xs text-neutral-500"
                >
                  Aucun produit disponible
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
          [routerLink]="['/dashboard/infirmier/traitements/list']"
          >Annuler</a
        >
      </div>
    </form>
  `,
})
export class TraitementsNewComponent {
  form: FormGroup;

  // Données dropdowns
  hospitalisations: string[] = [
    'HOSP-001 — Alice Dubois',
    'HOSP-002 — Jean Dupont',
    'HOSP-003 — Sophie Martin',
  ];
  produits: string[] = ['Paracétamol', 'Amoxicilline', 'Ibuprofène'];

  // États dropdowns
  hospitalisationSearch = '';
  hospitalisationDropdownOpen = false;
  hospitalisationActiveIndex = -1;
  @ViewChild('hospitalisationSearchInput') hospitalisationSearchRef?: ElementRef<HTMLInputElement>;

  produitSearch = '';
  produitDropdownOpen = false;
  produitActiveIndex = -1;
  @ViewChild('produitSearchInput') produitSearchRef?: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      dateDebut: [this.today(), Validators.required],
      dateFin: ['', Validators.required],
      doseJournaliere: ['', Validators.required],
      description: ['', Validators.required],
      hospitalisation: ['', Validators.required],
      produit: ['', Validators.required],
    });
  }

  private today(): string {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-');
  }

  // Hospitalisation helpers
  get filteredHospitalisations(): string[] {
    const q = this.hospitalisationSearch.trim().toLowerCase();
    if (!q) return this.hospitalisations;
    return this.hospitalisations.filter((h) => h.toLowerCase().includes(q));
  }
  toggleHospitalisationDropdown() {
    this.hospitalisationDropdownOpen = !this.hospitalisationDropdownOpen;
    if (this.hospitalisationDropdownOpen) {
      const list = this.filteredHospitalisations;
      const current = (this.form.get('hospitalisation')?.value as string) || '';
      const idx = list.findIndex((h) => h === current);
      this.hospitalisationActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.hospitalisationSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectHospitalisation(label: string) {
    this.form.get('hospitalisation')?.setValue(label, { emitEvent: true });
    this.hospitalisationDropdownOpen = false;
  }

  // Produit helpers
  get filteredProduits(): string[] {
    const q = this.produitSearch.trim().toLowerCase();
    if (!q) return this.produits;
    return this.produits.filter((p) => p.toLowerCase().includes(q));
  }
  toggleProduitDropdown() {
    this.produitDropdownOpen = !this.produitDropdownOpen;
    if (this.produitDropdownOpen) {
      const list = this.filteredProduits;
      const current = (this.form.get('produit')?.value as string) || '';
      const idx = list.findIndex((p) => p === current);
      this.produitActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.produitSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectProduit(label: string) {
    this.form.get('produit')?.setValue(label, { emitEvent: true });
    this.produitDropdownOpen = false;
  }

  submit() {
    if (this.form.invalid) return;
    this.router.navigate(['/dashboard/infirmier/traitements/list']);
  }
}
