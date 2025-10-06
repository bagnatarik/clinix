import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';
import { Rendezvous } from '../../../../core/interfaces/medical';
import { RendezvousService } from '../../../../core/services/rendezvous.service';


@Component({
  selector: 'app-doctor-rendezvous-list',
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
        [showNewButton]="false"
        (onRefresh)="refresh()"
        (onRowClick)="view($event)"
      ></app-data-table-component>
    </div>
  `,
})
export class DoctorRendezvousListComponent implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Date de rendez-vous', sortable: true },
    { key: 'heure', label: 'Heure de rendez-vous', sortable: true },
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'personnel', label: 'Personnel', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
  ];

  private allData: Rendezvous[] = [];
  dataSource: Rendezvous[] = [];
  private doctorName = '';

  constructor(private auth: AuthenticationService, private rdvService: RendezvousService) {}

  ngOnInit(): void {
    this.doctorName = this.auth.getCurrentUser()?.name ?? 'Doctor User';
    this.refresh();
  }

  refresh() {
    this.rdvService.getAll().subscribe((rows) => {
      this.allData = rows || [];
      this.dataSource = this.allData.filter((rdv) => rdv.personnel === this.doctorName);
    });
  }

  view(row: Rendezvous) {
    // À implémenter si une page détail existe
  }
}
