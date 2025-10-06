import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ConsultationsService } from '../../dashboard/doctor/consultations/consultations.service';
import { Consultation } from '../../core/interfaces/medical';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';

@Component({
  selector: 'app-patient-consultations-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Mes consultations</h2>
      </div>

      <app-data-table-component
        [tableName]="'Consultations'"
        [columns]="columns"
        [data]="dataSource"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [showNewButton]="false"
        (onRefresh)="refresh()"
        (onRowClick)="view($event)"
      ></app-data-table-component>

      <div class="text-xs text-gray-600" *ngIf="!loading && dataSource.length === 0">
        Aucun enregistrement trouvé pour votre compte.
      </div>
    </div>
  `,
})
export class PatientConsultationsList implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'motif', label: 'Motif', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
  ];

  private allData: Consultation[] = [];
  dataSource: Consultation[] = [];
  loading = false;
  private patientName = '';

  constructor(
    private service: ConsultationsService,
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
    this.service.getAll().subscribe((rows) => {
      this.allData = rows || [];
      this.dataSource = this.allData.filter((c) => c.patient === this.patientName);
      this.loading = false;
    });
  }

  view(row: Consultation) {
    this.router.navigate(['/patient/consultations', row.id, 'download']);
  }
}