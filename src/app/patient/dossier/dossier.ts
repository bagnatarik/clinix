import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConsultationsService } from '../../dashboard/doctor/consultations/consultations.service';
import { Consultation } from '../../core/interfaces/medical';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { PatientsService, Patient } from '../../dashboard/nurse/patients/patients.service';

@Component({
  selector: 'app-patient-dossier',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Mon dossier</h2>
      </div>

      <div class="bg-white border border-neutral-300 rounded p-5 text-sm text-gray-700">
        <div class="mb-3">
          <span class="text-gray-600">Patient:</span>
          <span class="font-medium text-gray-800">{{ patientName }}</span>
        </div>
        <p class="text-gray-700">Consultez l’ensemble de vos informations et historiques.</p>
      </div>

      <!-- SECTION Mes informations (profil) -->
      <div class="space-y-3">
        <h3 class="text-lg font-semibold text-gray-800">Mes informations</h3>

        <div
          *ngIf="loadingPatient"
          class="border border-neutral-300 rounded p-4 text-sm text-gray-700"
        >
          Chargement…
        </div>

        <div *ngIf="!loadingPatient">
          <ng-container *ngIf="patient; else noInfo">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-neutral-300 rounded p-4 bg-white">
                <p class="text-sm font-semibold text-gray-800">Identité</p>
                <div class="mt-2 text-sm text-gray-700 space-y-1">
                  <div><span class="text-gray-600">Nom:</span> {{ patient!.nom }}</div>
                  <div><span class="text-gray-600">Prénom:</span> {{ patient!.prenom }}</div>
                  <div><span class="text-gray-600">Sexe:</span> {{ patient!.sexe }}</div>
                  <div>
                    <span class="text-gray-600">Date de naissance:</span>
                    {{ patient!.dateNaissance || '-' }}
                  </div>
                </div>
              </div>

              <div class="border border-neutral-300 rounded p-4 bg-white">
                <p class="text-sm font-semibold text-gray-800">Contact</p>
                <div class="mt-2 text-sm text-gray-700 space-y-1">
                  <div><span class="text-gray-600">Email:</span> {{ patient!.email || '-' }}</div>
                  <div>
                    <span class="text-gray-600">Téléphone:</span> {{ patient!.telephone || '-' }}
                  </div>
                  <div>
                    <span class="text-gray-600">Adresse:</span> {{ patient!.adresse || '-' }}
                  </div>
                </div>
              </div>

              <div class="border border-neutral-300 rounded p-4 bg-white col-span-2">
                <p class="text-sm font-semibold text-gray-800">Statut</p>
                <div class="mt-2 text-sm text-gray-700">
                  <span
                    class="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200"
                    >{{ patient!.statut }}</span
                  >
                </div>
              </div>
            </div>

            <div *ngIf="patient!.id === 'PAT-VIRT'" class="text-xs text-gray-500">
              Profil affiché d’après votre compte (données fictives).
            </div>
          </ng-container>
          <ng-template #noInfo>
            <div class="border border-neutral-300 rounded p-4 text-sm text-gray-700">
              Aucune information disponible.
            </div>
          </ng-template>
        </div>
      </div>

      <!-- SECTION Consultations complètes du dossier -->
      <div class="bg-white border border-neutral-300 rounded p-5">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">Mes consultations</h3>
          <!-- <a
            [routerLink]="['/patient/consultations/list']"
            class="text-xs text-blue-700 hover:underline"
            >Voir la liste</a
          > -->
        </div>

        <!-- Filtres -->
        <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Filtre par date -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input
              type="date"
              [(ngModel)]="searchDate"
              (ngModelChange)="applyFilters()"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none"
            />
          </div>

          <!-- Filtre par statut (dropdown custom) -->
          <div class="relative">
            <label class="block text-xs font-medium text-gray-500 mb-1">Statut</label>
            <button
              type="button"
              class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
              (click)="toggleStatusDropdown($event)"
              [attr.aria-expanded]="statusDropdownOpen"
            >
              <span>{{ selectedStatus || 'Sélectionner un statut' }}</span>
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
              *ngIf="statusDropdownOpen"
              class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
              (click)="$event.stopPropagation()"
              (mousedown)="$event.stopPropagation()"
            >
              <input
                type="text"
                [(ngModel)]="statusSearch"
                (ngModelChange)="filterStatusList()"
                placeholder="Rechercher un statut..."
                class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
              />

              <div class="max-h-44 overflow-y-auto">
                <button
                  type="button"
                  class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                  *ngFor="let s of filteredStatuses; let i = index"
                  (mouseenter)="activeStatusIndex = i"
                  [class.bg-blue-50]="activeStatusIndex === i || selectedStatus === s"
                  (click)="selectStatus(s)"
                >
                  {{ s }}
                </button>
                <div
                  *ngIf="filteredStatuses.length === 0"
                  class="px-3 py-2 text-xs text-neutral-500"
                >
                  Aucun statut trouvé
                </div>
              </div>

              <div class="flex items-center justify-between mt-2">
                <button
                  type="button"
                  class="text-xs text-gray-600 hover:underline"
                  (click)="clearStatus()"
                >
                  Effacer
                </button>
                <button
                  type="button"
                  class="text-xs text-blue-700 hover:underline"
                  (click)="statusDropdownOpen = false"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-end gap-2">
            <button
              type="button"
              class="border border-neutral-300 rounded px-3 py-2 text-sm"
              (click)="resetFilters()"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        <div *ngIf="loading" class="text-sm text-gray-600 mt-2">Chargement…</div>
        <div
          *ngIf="!loading && filteredConsultations.length === 0"
          class="text-sm text-gray-600 mt-2"
        >
          Aucune consultation trouvée.
        </div>

        <div class="space-y-4 mt-3" *ngIf="!loading && filteredConsultations.length > 0">
          <div *ngFor="let c of filteredConsultations" class="border border-neutral-200 rounded">
            <div class="p-4 bg-neutral-50">
              <div class="flex items-center justify-between">
                <div class="font-medium text-gray-800">Consultation #{{ c.id }}</div>
                <div class="text-xs text-gray-600">{{ c.date }} • {{ c.statut }}</div>
              </div>
              <div class="text-xs text-gray-600">Motif: {{ c.motif }}</div>
            </div>

            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <!-- Diagnostics -->
              <div>
                <div class="font-semibold text-gray-800 mb-2">Diagnostics</div>
                <div *ngIf="c.diagnostics?.length; else noDiag">
                  <ul class="list-disc list-inside space-y-1">
                    <li *ngFor="let d of c.diagnostics">
                      <span class="text-gray-800">{{ d.maladie }}</span>
                      <span class="text-gray-600" *ngIf="d.details"> — {{ d.details }}</span>
                      <span class="text-gray-600" *ngIf="d.gravite"> ({{ d.gravite }})</span>
                    </li>
                  </ul>
                </div>
                <ng-template #noDiag>
                  <div class="text-xs text-gray-600">Aucun diagnostic renseigné.</div>
                </ng-template>
              </div>

              <!-- Hospitalisations -->
              <div>
                <div class="font-semibold text-gray-800 mb-2">Hospitalisations</div>
                <div *ngIf="c.hospitalisations?.length; else noHosp">
                  <ul class="list-disc list-inside space-y-1">
                    <li *ngFor="let h of c.hospitalisations">
                      <span class="text-gray-800">Admission: {{ h.dateAdmission }}</span>
                      <span class="text-gray-600" *ngIf="h.dateSortie">
                        • Sortie: {{ h.dateSortie }}</span
                      >
                      <div class="text-gray-600" *ngIf="h.motif">Motif: {{ h.motif }}</div>
                    </li>
                  </ul>
                </div>
                <ng-template #noHosp>
                  <div class="text-xs text-gray-600">Aucune hospitalisation associée.</div>
                </ng-template>
              </div>

              <!-- Analyses / prélèvements -->
              <div>
                <div class="font-semibold text-gray-800 mb-2">Analyses et prélèvements</div>
                <div *ngIf="c.analyses?.length; else noAna">
                  <ul class="list-disc list-inside space-y-1">
                    <li *ngFor="let a of c.analyses">
                      <span class="text-gray-800">{{ a.nomAnalyse }}</span>
                      <span class="text-gray-600"> — {{ a.dateAnalyse }}</span>
                      <div class="text-gray-600" *ngIf="a.typeAnalyse">
                        Type: {{ a.typeAnalyse }}
                      </div>
                      <div class="text-gray-600" *ngIf="a.description">{{ a.description }}</div>
                    </li>
                  </ul>
                </div>
                <ng-template #noAna>
                  <div class="text-xs text-gray-600">Aucune analyse renseignée.</div>
                </ng-template>
              </div>

              <!-- Prescriptions -->
              <div>
                <div class="font-semibold text-gray-800 mb-2">Prescriptions</div>
                <div *ngIf="c.prescriptions?.length; else noPres">
                  <ul class="list-disc list-inside space-y-1">
                    <li *ngFor="let p of c.prescriptions">
                      <span class="text-gray-800">{{ p.date }}</span>
                      <span class="text-gray-600" *ngIf="p.motif"> — {{ p.motif }}</span>
                      <div class="text-gray-600" *ngIf="p.description">{{ p.description }}</div>
                    </li>
                  </ul>
                </div>
                <ng-template #noPres>
                  <div class="text-xs text-gray-600">Aucune prescription.</div>
                </ng-template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Liens rapides existants -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          [routerLink]="['/patient/rdv/list']"
          class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition"
        >
          <div class="font-semibold text-gray-800">Mes rendez-vous</div>
          <div class="text-xs text-gray-600">Historique et prise de rendez-vous</div>
        </a>
        <a
          [routerLink]="['/patient/consultations/list']"
          class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition"
        >
          <div class="font-semibold text-gray-800">Mes consultations</div>
          <div class="text-xs text-gray-600">Historique et comptes-rendus</div>
        </a>
        <a
          [routerLink]="['/patient/analyses/list']"
          class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition"
        >
          <div class="font-semibold text-gray-800">Mes analyses</div>
          <div class="text-xs text-gray-600">Résultats et téléchargements</div>
        </a>
        <a
          [routerLink]="['/patient/profile/info']"
          class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition"
        >
          <div class="font-semibold text-gray-800">Mon profil</div>
          <div class="text-xs text-gray-600">Informations personnelles</div>
        </a>
        <a
          [routerLink]="['/patient/profile/insurance']"
          class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition"
        >
          <div class="font-semibold text-gray-800">Mon assurance</div>
          <div class="text-xs text-gray-600">Informations d’assurance</div>
        </a>
      </div> -->
    </div>
    <div class="size-5"></div>
  `,
})
export class PatientDossier implements OnInit {
  patientName: string;
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  loading = false;
  // Profil patient
  loadingPatient = false;
  patient: Patient | null = null;
  // Filtres
  searchDate = '';
  selectedStatus: '' | 'planifiée' | 'terminée' | 'annulée' | null = null;
  // Dropdown statut
  statusDropdownOpen = false;
  statuses: Array<'planifiée' | 'terminée' | 'annulée'> = ['planifiée', 'terminée', 'annulée'];
  filteredStatuses: Array<'planifiée' | 'terminée' | 'annulée'> = this.statuses;
  statusSearch = '';
  activeStatusIndex = -1;

  constructor(
    private auth: AuthenticationService,
    private consultationsService: ConsultationsService,
    private patientsService: PatientsService
  ) {
    this.patientName = this.auth.getCurrentUser()?.name ?? 'Patient User';
  }

  ngOnInit() {
    this.refreshPatient();
    this.loadConsultations();
  }

  private loadConsultations() {
    this.loading = true;
    this.consultationsService.getAll().subscribe((rows) => {
      const data = rows || [];
      this.consultations = data.filter((c) => c.patient === this.patientName);
      this.filteredConsultations = [...this.consultations];
      this.loading = false;
    });
  }

  private refreshPatient(): void {
    this.loadingPatient = true;
    this.patientsService.getAll().subscribe((list) => {
      const match = list.find(
        (p) => `${p.prenom} ${p.nom}`.trim().toLowerCase() === this.patientName.trim().toLowerCase()
      );
      this.patient = match ?? this.deriveFromUser();
      this.loadingPatient = false;
    });
  }

  private deriveFromUser(): Patient {
    const user = this.auth.getCurrentUser();
    const name = user?.name ?? 'Patient User';
    const parts = name.trim().split(' ');
    const prenom = parts.length > 1 ? parts.slice(0, -1).join(' ') : name;
    const nom = parts.length > 1 ? parts.slice(-1).join(' ') : name;
    return {
      id: 'PAT-VIRT',
      prenom,
      nom,
      sexe: 'H',
      email: user?.email,
      statut: 'actif',
    } as Patient;
  }

  applyFilters() {
    const date = this.searchDate?.trim();
    const statut = this.selectedStatus || '';
    this.filteredConsultations = this.consultations.filter((c) => {
      const matchDate = date ? this.sameDay(c.date, date) : true;
      const matchStatus = statut ? c.statut === statut : true;
      return matchDate && matchStatus;
    });
  }

  resetFilters() {
    this.searchDate = '';
    this.selectedStatus = null;
    this.statusSearch = '';
    this.filteredStatuses = [...this.statuses];
    this.applyFilters();
  }

  sameDay(iso: string, yyyyMMdd: string) {
    // iso: e.g., '2025-03-14T10:00:00Z' or '2025-03-14'
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const normalized = `${y}-${m}-${day}`;
    return normalized === yyyyMMdd;
  }

  toggleStatusDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  selectStatus(s: 'planifiée' | 'terminée' | 'annulée') {
    this.selectedStatus = s;
    this.statusDropdownOpen = false;
    this.applyFilters();
  }

  clearStatus() {
    this.selectedStatus = null;
    this.applyFilters();
  }

  filterStatusList() {
    const q = this.statusSearch.trim().toLowerCase();
    this.filteredStatuses = this.statuses.filter((s) => s.toLowerCase().includes(q));
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.statusDropdownOpen = false;
  }
}
