import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { Rendezvous } from '../../core/interfaces/medical';
import { RendezvousService } from '../../core/services/rendezvous.service';

@Component({
  selector: 'app-patient-rdv-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <app-data-table-component
        [tableName]="'Rendez-vous'"
        [columns]="columns"
        [data]="dataSource"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [showNewButton]="true"
        [newButtonLabel]="'Prendre RDV'"
        (onRefresh)="refresh()"
        (onNew)="createNew()"
        (onRowClick)="view($event)"
      ></app-data-table-component>

      <div class="text-xs text-gray-600" *ngIf="!loading && dataSource.length === 0">
        Aucun rendez-vous trouvé pour votre compte.
      </div>
    </div>
  `,
})
export class RdvList implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'heure', label: 'Heure', sortable: true },
    { key: 'personnel', label: 'Personnel', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
  ];

  private allData: Rendezvous[] = [];
  dataSource: Rendezvous[] = [];
  loading = false;
  private patientName = '';

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private rdvService: RendezvousService
  ) {
    this.patientName = this.auth.getCurrentUser()?.name ?? 'Patient User';
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.rdvService.getAll().subscribe((rows) => {
      this.allData = rows || [];
      this.dataSource = this.allData.filter((rdv) => rdv.patient === this.patientName);
      this.loading = false;
    });
  }

  createNew() {
    this.router.navigate(['/patient/rdv/new']);
  }

  view(row: any) {
    // Placeholder: naviguer vers détail RDV quand disponible
    this.router.navigate(['/patient/rdv/list']);
  }
}