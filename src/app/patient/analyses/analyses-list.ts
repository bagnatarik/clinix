import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { ConsultationsService } from '../../dashboard/doctor/consultations/consultations.service';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { Consultation } from '../../core/interfaces/medical';

@Component({
  selector: 'app-patient-analyses-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Mes analyses</h2>
      </div>

      <app-data-table-component
        [tableName]="'Analyses'"
        [columns]="columns"
        [data]="rows"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [showNewButton]="false"
        [showViewButton]="true"
        [showEditButton]="false"
        [showDeleteButton]="false"
        (onRefresh)="refresh()"
        (onRowClick)="view($event)"
        (onView)="openViewModal($event)"
      ></app-data-table-component>

      <div class="text-xs text-gray-600" *ngIf="!loading && rows.length === 0">
        Aucun résultat d’analyse trouvé pour votre compte.
      </div>

      <!-- Modal détail analyses (liste + résultats + téléchargement) -->
      <div
        *ngIf="viewModalOpen"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="px-5 py-3 border-b border-neutral-300 flex items-center justify-between">
            <div class="text-base font-semibold text-gray-800">Détails des analyses</div>
            <button
              type="button"
              class="text-neutral-500 hover:text-neutral-700"
              (click)="closeViewModal()"
            >
              ✕
            </button>
          </div>
          <div class="p-5 space-y-4">
            <div class="text-sm text-gray-600" *ngIf="selectedConsultationId">
              Consultation: {{ selectedConsultationId }}
            </div>

            <div *ngIf="selectedAnalyses.length; else noAna" class="space-y-3">
              <div *ngFor="let a of selectedAnalyses" class="border border-neutral-300 rounded p-4">
                <div class="font-medium text-gray-800">{{ a.nomAnalyse }}</div>
                <div class="text-xs text-gray-600">
                  Type: {{ a.typeAnalyse || '—' }} • Réf. diagnostic: {{ a.diagnosticRef || '—' }}
                </div>
                <div class="text-xs text-gray-600">Date: {{ a.dateAnalyse }}</div>
                <div class="mt-2 text-sm text-gray-700">
                  <span class="font-semibold">Résultat:</span>
                  <span>{{ a.description || '—' }}</span>
                </div>

                <div class="mt-3 flex items-center gap-2">
                  <button
                    class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm w-full"
                    (click)="download(a)"
                  >
                    Télécharger PDF
                  </button>
                </div>
              </div>
            </div>
            <ng-template #noAna>
              <div class="text-xs text-gray-600">Aucune analyse associée.</div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PatientAnalysesList implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'nomAnalyse', label: 'Analyse', sortable: true },
    { key: 'typeAnalyse', label: 'Type', sortable: true },
    { key: 'dateAnalyse', label: 'Date', sortable: true },
    { key: 'diagnosticRef', label: 'Référence diagnostic', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  rows: any[] = [];
  loading = false;
  private patientName = '';
  // Modal state
  viewModalOpen = false;
  selectedAnalyses: any[] = [];
  selectedConsultationId: string | null = null;

  constructor(
    private consultations: ConsultationsService,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.patientName = this.auth.getCurrentUser()?.name ?? 'Patient User';
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.consultations.getAll().subscribe((list: Consultation[]) => {
      const mine = (list || []).filter((c) => c.patient === this.patientName);
      const aggregated: any[] = [];
      mine.forEach((c) => {
        (c.analyses || []).forEach((a, index) => {
          const id = `CONS-${c.id}-AN-${index + 1}`;
          aggregated.push({ id, consultationId: c.id, consultationDate: c.date, ...a });
        });
      });
      this.rows = aggregated;
      this.loading = false;
    });
  }

  view(row: any) {
    this.router.navigate(['/patient/analyses', row.id, 'download']);
  }

  openViewModal(row: any) {
    const cid = row?.consultationId || null;
    this.selectedConsultationId = cid;
    this.selectedAnalyses = this.rows.filter((r) => r.consultationId === cid);
    this.viewModalOpen = true;
  }

  closeViewModal() {
    this.viewModalOpen = false;
    this.selectedAnalyses = [];
    this.selectedConsultationId = null;
  }

  download(a: any) {
    // Reuse existing download route
    this.router.navigate(['/patient/analyses', a.id, 'download']);
  }
}
