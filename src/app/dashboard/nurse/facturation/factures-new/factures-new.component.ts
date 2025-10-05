import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-factures-new-nurse',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-white border border-neutral-200 rounded shadow-sm">
        <div class="px-5 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-semibold text-gray-800">Nouvelle facture</h2>
          <p class="text-xs text-gray-500">Renseignez les informations de facturation.</p>
        </div>
        <div class="p-5">
          <form [formGroup]="form" class="space-y-6" (ngSubmit)="submit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-1">Patient </label>
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
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <div
                  *ngIf="patientDropdownOpen"
                  class="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded shadow-lg"
                >
                  <div class="p-2 border-b border-neutral-200">
                    <input
                      #patientSearchInput
                      [(ngModel)]="patientSearch"
                      [ngModelOptions]="{ standalone: true }"
                      name="patientSearch"
                      placeholder="Rechercher un patient"
                      class="w-full border border-neutral-300 rounded px-2 py-1 text-sm focus:outline-none"
                    />
                  </div>
                  <ul class="max-h-52 overflow-auto text-sm">
                    <li
                      *ngFor="let p of filteredPatients; let idx = index"
                      (click)="selectPatientName(p)"
                      [class.bg-neutral-100]="idx === activeIndex"
                      class="px-3 py-2 cursor-pointer hover:bg-neutral-50"
                    >
                      {{ p }}
                    </li>
                    <li *ngIf="filteredPatients.length === 0" class="px-3 py-2 text-neutral-500">
                      Aucun résultat
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Consultation (conditionnel: affiché uniquement si patient sélectionné) -->
              <div class="relative" *ngIf="form.value.patient">
                <label class="block text-sm font-medium text-gray-700 mb-1">Consultation</label>
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
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <div
                  *ngIf="consultationDropdownOpen"
                  class="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded shadow-lg"
                >
                  <div class="p-2 border-b border-neutral-200">
                    <input
                      #consultationSearchInput
                      [(ngModel)]="consultationSearch"
                      [ngModelOptions]="{ standalone: true }"
                      name="consultationSearch"
                      placeholder="Rechercher une consultation"
                      class="w-full border border-neutral-300 rounded px-2 py-1 text-sm focus:outline-none"
                    />
                  </div>
                  <ul class="max-h-52 overflow-auto text-sm">
                    <li
                      *ngFor="let c of filteredConsultations; let idx = index"
                      (click)="selectConsultation(c)"
                      [class.bg-neutral-100]="idx === consultationActiveIndex"
                      class="px-3 py-2 cursor-pointer hover:bg-neutral-50"
                    >
                      {{ c }}
                    </li>
                    <li
                      *ngIf="filteredConsultations.length === 0"
                      class="px-3 py-2 text-neutral-500"
                    >
                      Aucun résultat
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date de facture </label>
                <input
                  type="date"
                  formControlName="dateFacture"
                  class="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Statut </label>
                <select
                  formControlName="statut"
                  class="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="En attente">En attente</option>
                  <option value="Payée">Payée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Coût total (auto)</label
                >
                <input
                  [value]="total | number : '1.2-2'"
                  class="w-full rounded border border-neutral-300 px-3 py-2 text-sm bg-gray-50 outline-none cursor-no-drop"
                  readonly
                />
              </div>
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-800">Détails de facturation</h3>
                <!-- <button
                  type="button"
                  class="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                  (click)="addDetail()"
                >
                  Ajouter un détail
                </button> -->
              </div>
              <div formArrayName="details" class="space-y-3">
                <div
                  *ngFor="let d of details.controls; let i = index"
                  [formGroupName]="i"
                  class="grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                >
                  <div class="md:col-span-8">
                    <label class="block text-xs text-gray-700 mb-1">Désignation</label>
                    <input
                      formControlName="designation"
                      class="w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none cursor-no-drop bg-gray-50"
                      readonly
                    />
                  </div>
                  <div class="md:col-span-4">
                    <label class="block text-xs text-gray-700 mb-1">Montant</label>
                    <input
                      type="number"
                      step="0.01"
                      formControlName="montant"
                      class="w-full rounded border border-neutral-300 px-3 py-2 text-sm outline-none cursor-no-drop bg-gray-50"
                      readonly
                    />
                  </div>
                  <!-- <div class="md:col-span-1">
                    <button
                      type="button"
                      class="w-full px-3 py-2 text-sm rounded border border-neutral-300 text-gray-700 hover:bg-gray-50"
                      (click)="removeDetail(i)"
                    >
                      Supprimer
                    </button>
                  </div> -->
                </div>
                <div *ngIf="details.length === 0" class="text-xs text-gray-500">
                  Aucun détail pour l'instant.
                </div>
              </div>
            </div>

            <div class="flex gap-3 justify-end pt-2">
              <button
                type="button"
                class="px-4 py-2 text-sm rounded border border-neutral-300 text-gray-700 hover:bg-gray-50"
                (click)="cancel()"
              >
                Annuler
              </button>
              <button
                type="submit"
                [disabled]="form.invalid || details.length === 0"
                class="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer la facture
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class FacturesNewNurseComponent {
  form!: FormGroup;
  // Dropdown patient façon Consultations/Ordonnances
  patients: string[] = ['Alice Dubois', 'Jean Dupont', 'Sophie Martin', 'Paul Bernard'];
  patientSearch: string = '';
  patientDropdownOpen = false;
  activeIndex: number = -1;
  @ViewChild('patientSearchInput') patientSearchRef?: ElementRef<HTMLInputElement>;
  // Consultation selector
  consultationsByPatient: Record<string, string[]> = {
    'Alice Dubois': [
      'CONS-2025-001 — 2025-10-01 — Suivi général',
      'CONS-2025-006 — 2025-10-03 — Douleur tête',
    ],
    'Jean Dupont': ['CONS-2025-002 — 2025-09-28 — Contrôle tension'],
    'Sophie Martin': ['CONS-2025-003 — 2025-10-02 — Fièvre'],
    'Paul Bernard': ['CONS-2025-004 — 2025-09-30 — Bilan annuel'],
  };
  consultationSearch: string = '';
  consultationDropdownOpen = false;
  consultationActiveIndex: number = -1;
  @ViewChild('consultationSearchInput') consultationSearchRef?: ElementRef<HTMLInputElement>;

  get details(): FormArray {
    return this.form.get('details') as FormArray;
  }

  get total(): number {
    return this.details.controls.reduce(
      (sum, ctrl) => sum + Number(ctrl.get('montant')?.value || 0),
      0
    );
  }

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      consultation: [''],
      dateFacture: ['', Validators.required],
      statut: ['En attente', Validators.required],
      details: this.fb.array([]),
    });

    // Initialiser la date de facture automatiquement à aujourd'hui
    this.form.get('dateFacture')?.setValue(this.todayStr(), { emitEvent: false });

    // Réinitialiser consultation et détails quand le patient change
    this.form.get('patient')?.valueChanges.subscribe(() => {
      this.form.get('consultation')?.setValue('', { emitEvent: false });
      this.details.clear();
      // Mettre à jour la date de facture à aujourd'hui sur changement de patient
      this.form.get('dateFacture')?.setValue(this.todayStr(), { emitEvent: false });
    });

    // Auto-remplir les détails dès qu'une consultation est choisie
    this.form.get('consultation')?.valueChanges.subscribe((label) => {
      this.autoFillDetailsFromConsultation((label as string) || '');
      // Si la consultation contient une date, utiliser celle-ci comme date de facture
      const parsed = this.parseConsultationDateFromLabel((label as string) || '');
      if (parsed) {
        this.form.get('dateFacture')?.setValue(parsed, { emitEvent: false });
      }
    });
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

  // Auto-fill des détails de facturation basé sur la consultation sélectionnée
  private autoFillDetailsFromConsultation(label: string) {
    // Nettoyer les détails existants
    this.details.clear();

    // Règles simples basées sur le motif dans le libellé
    // Par défaut: Consultation infirmière
    this.details.push(
      this.fb.group({
        designation: ['Consultation infirmière', Validators.required],
        montant: [500, [Validators.required, Validators.min(0)]],
      })
    );

    const lower = label.toLowerCase();
    // Ajouts conditionnels (exemples basés sur mots-clés)
    if (lower.includes('fièvre')) {
      this.details.push(
        this.fb.group({
          designation: ['Prise de température', Validators.required],
          montant: [100, [Validators.required, Validators.min(0)]],
        })
      );
    }
    if (lower.includes('tension')) {
      this.details.push(
        this.fb.group({
          designation: ['Mesure tension artérielle', Validators.required],
          montant: [150, [Validators.required, Validators.min(0)]],
        })
      );
    }
    if (lower.includes('douleur tête') || lower.includes('céphalée')) {
      this.details.push(
        this.fb.group({
          designation: ['Administration analgésique', Validators.required],
          montant: [200, [Validators.required, Validators.min(0)]],
        })
      );
    }
    if (lower.includes('bilan') || lower.includes('suivi')) {
      this.details.push(
        this.fb.group({
          designation: ['Bilan paramédical', Validators.required],
          montant: [250, [Validators.required, Validators.min(0)]],
        })
      );
    }
  }

  // Utilitaires de date
  private todayStr(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private parseConsultationDateFromLabel(label: string): string | null {
    // Exemple de libellé: "CONS-2025-001 — 2025-10-01 — Suivi général"
    const parts = label.split('—').map((s) => s.trim());
    for (const p of parts) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(p)) return p;
    }
    return null;
  }

  addDetail() {
    this.details.push(
      this.fb.group({
        designation: ['', Validators.required],
        montant: [0, [Validators.required, Validators.min(0)]],
      })
    );
  }

  removeDetail(index: number) {
    if (index < 0 || index >= this.details.length) return;
    this.details.removeAt(index);
  }

  submit() {
    if (this.form.invalid || this.details.length === 0) return;
    // TODO: appeler service pour créer la facture (FACTURES + DETAILS_FACTURATION)
    this.router.navigate(['/dashboard/infirmier/facturation/list']);
  }

  cancel() {
    this.router.navigate(['/dashboard/infirmier/facturation/list']);
  }
}
