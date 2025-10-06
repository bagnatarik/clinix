import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';
import { Rendezvous } from '../../../../core/interfaces/medical';
import { RendezvousService } from '../../../../core/services/rendezvous.service';

type ListRendezvous = Rendezvous & { isFirstForPatient?: boolean };

@Component({
  selector: 'app-rendezvous-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, ReactiveFormsModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Rendez-vous</h2>
      </div>

      <app-data-table-component
        [tableName]="'Rendez-vous'"
        [columns]="columns"
        [data]="dataSource"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [newButtonLabel]="'Nouveau rendez-vous'"
        [showNewButton]="true"
        (onNew)="addNew()"
        (onRefresh)="refresh()"
        (onEdit)="edit($event)"
        (onDelete)="delete($event)"
        (onRowClick)="view($event)"
        (onFirstAppointmentAction)="openFirstAppointmentModal($event)"
      ></app-data-table-component>
      <div
        *ngIf="firstAppointmentModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/30" (click)="closeModal()"></div>
        <div
          class="relative bg-white border border-neutral-300 rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Valider le dossier du patient</h3>
            <button
              class="p-2 rounded hover:bg-neutral-100"
              (click)="closeModal()"
              aria-label="Fermer"
            >
              <svg
                class="w-5 h-5 text-neutral-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6L6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Patient</label>
              <input
                type="text"
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm bg-neutral-50"
                [value]="selectedPatientName"
                readonly
              />
            </div>

            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-gray-700">Antécédents</h3>
              <div class="space-y-4" [formGroup]="antecedentsForm">
                <div formArrayName="antecedents">
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                    *ngFor="let group of antecedents.controls; let i = index"
                    [formGroupName]="i"
                  >
                    <div class="relative">
                      <label class="block text-xs font-medium text-gray-500 mb-1"
                        >Type d'antécédent</label
                      >
                      <button
                        type="button"
                        class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
                        (click)="toggleTypeDropdown(i)"
                        [attr.aria-expanded]="typeDropdownOpenIndex === i"
                      >
                        <span>{{ group.get('type')?.value || 'Sélectionner un type' }}</span>
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
                        *ngIf="typeDropdownOpenIndex === i"
                        class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
                        (click)="$event.stopPropagation()"
                        (mousedown)="$event.stopPropagation()"
                      >
                        <input
                          type="text"
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
                            *ngFor="let t of filteredTypes; let ti = index"
                            (mouseenter)="typeActiveIndex = ti"
                            [class.bg-blue-50]="
                              typeActiveIndex === ti || group.get('type')?.value === t
                            "
                            (click)="selectType(i, t)"
                          >
                            {{ t }}
                          </button>

                          <div
                            *ngIf="filteredTypes.length === 0"
                            class="px-3 py-2 text-xs text-neutral-500"
                          >
                            Aucun type trouvé
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="md:col-span-2">
                      <label class="block text-xs font-medium text-gray-500 mb-1"
                        >Description</label
                      >
                      <textarea
                        rows="3"
                        class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                        formControlName="description"
                      ></textarea>
                    </div>

                    <div class="md:col-span-2 flex justify-end">
                      <button
                        type="button"
                        (click)="removeAntecedent(i)"
                        class="px-3 py-2 text-sm border border-neutral-300 rounded hover:bg-neutral-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                (click)="addAntecedent()"
                class="px-4 py-2 text-sm border border-neutral-300 rounded hover:bg-neutral-50"
              >
                Ajouter un antécédent
              </button>
            </div>

            <div class="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                (click)="validatePatientFile()"
                class="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                Valider
              </button>
              <button
                type="button"
                (click)="closeModal()"
                class="px-3 py-2 rounded bg-neutral-100 border border-neutral-300 text-sm hover:bg-neutral-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RendezvousListComponent implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Date de rendez-vous', sortable: true },
    { key: 'heure', label: 'Heure de rendez-vous', sortable: true },
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'personnel', label: 'Personnel', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  dataSource: ListRendezvous[] = [];

  constructor(private router: Router, private fb: FormBuilder, private rdvService: RendezvousService) {
    // Initialisation sûre du formulaire pour éviter "Property 'fb' is used before its initialization"
    this.antecedentsForm = this.fb.group({ antecedents: this.fb.array([]) });
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.rdvService.getAll().subscribe((rows) => {
      const list = (rows || []).map((r) => ({ ...r } as ListRendezvous));
      this.dataSource = list;
    });
  }

  addNew() {
    this.router.navigate(['/dashboard/infirmier/rendezvous/new']);
  }

  edit(row: ListRendezvous) {
    // Placeholder: pas d’écran d’édition dédié pour le moment
    this.router.navigate(['/dashboard/infirmier/rendezvous/new']);
  }

  delete(row: ListRendezvous) {
    this.rdvService.delete(row.id).subscribe(() => {
      this.refresh();
    });
  }

  view(row: ListRendezvous) {
    // À implémenter si une page détail existe
  }

  // État et gestion du modal premier rendez-vous
  firstAppointmentModalOpen = false;
  selectedPatientName = '';

  openFirstAppointmentModal(row: ListRendezvous) {
    this.selectedPatientName = row.patient;
    this.firstAppointmentModalOpen = true;
    while (this.antecedents.length) this.antecedents.removeAt(0);
    // this.addAntecedent();
    this.typeDropdownOpenIndex = null;
    this.typeSearch = '';
    this.typeActiveIndex = -1;
  }

  closeModal() {
    this.firstAppointmentModalOpen = false;
    this.selectedPatientName = '';
  }

  validatePatientFile() {
    // Placeholder: action de validation du dossier patient
    console.log('Validation du dossier pour', this.selectedPatientName);
    this.closeModal();
  }

  // --- Gestion antécédents façon PatientsNew ---
  antecedentsForm!: FormGroup;
  get antecedents(): FormArray {
    return this.antecedentsForm.get('antecedents') as FormArray;
  }

  typeDropdownOpenIndex: number | null = null;
  typeSearch = '';
  typeActiveIndex = -1;
  typesAntecedent: string[] = ['Allergie', 'Médical', 'Chirurgical', 'Familial', 'Autre'];

  get filteredTypes(): string[] {
    const q = this.typeSearch.trim().toLowerCase();
    if (!q) return this.typesAntecedent;
    return this.typesAntecedent.filter((t) => t.toLowerCase().includes(q));
  }

  toggleTypeDropdown(i: number) {
    this.typeDropdownOpenIndex = this.typeDropdownOpenIndex === i ? null : i;
    this.typeSearch = '';
    this.typeActiveIndex = -1;
  }

  selectType(i: number, type: string) {
    (this.antecedents.at(i) as FormGroup).get('type')?.setValue(type);
    this.typeDropdownOpenIndex = null;
  }

  addAntecedent() {
    this.antecedents.push(
      this.fb.group({
        type: [''],
        description: [''],
      })
    );
  }

  removeAntecedent(index: number) {
    this.antecedents.removeAt(index);
  }

  // Initialiser antécédents à l’ouverture du modal (gérée dans openFirstAppointmentModal)
}
