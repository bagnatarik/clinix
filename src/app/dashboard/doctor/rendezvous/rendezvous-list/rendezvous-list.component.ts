import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';

type Rendezvous = {
  id: string;
  date: string;
  statut: 'planifié' | 'honoré' | 'annulé';
  heure: string;
  patient: string;
  personnel: string; // médecin responsable
};

@Component({
  selector: 'app-doctor-rendezvous-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Mes rendez-vous</h2>
      </div>

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

  constructor(private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.doctorName = this.auth.getCurrentUser()?.name ?? 'Doctor User';
    this.refresh();
  }

  refresh() {
    // Données d’exemple – devront être remplacées par un service réel
    this.allData = [
      {
        id: 'RDV-010',
        date: '2025-10-07',
        statut: 'planifié',
        heure: '10:00',
        patient: 'Karim Benali',
        personnel: 'Doctor User',
      },
      {
        id: 'RDV-011',
        date: '2025-10-07',
        statut: 'annulé',
        heure: '11:30',
        patient: 'Nadia Lamrani',
        personnel: 'Dr. Anne Mercier',
      },
      {
        id: 'RDV-012',
        date: '2025-10-08',
        statut: 'honoré',
        heure: '09:00',
        patient: 'Youssef El Amrani',
        personnel: 'Doctor User',
      },
    ];

    // Filtrer pour n’afficher que les rendez-vous du docteur connecté
    this.dataSource = this.allData.filter((rdv) => rdv.personnel === this.doctorName);
  }

  view(row: Rendezvous) {
    // À implémenter si une page détail existe
  }
}