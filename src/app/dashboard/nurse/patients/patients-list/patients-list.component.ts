import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';
import { PatientsService, Patient } from '../patients.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-patients-list-nurse',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Patients</h2>
      </div>

      <app-data-table-component
        [tableName]="'Patients'"
        [columns]="columns"
        [data]="dataSource"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [newButtonLabel]="'Nouveau patient'"
        [showNewButton]="true"
        [showEditButton]="true"
        (onNew)="addNew()"
        (onRefresh)="refresh()"
        (onEdit)="edit($event)"
        (onDelete)="remove($event)"
        (onRowClick)="view($event)"
      ></app-data-table-component>
    </div>
  `,
})
export class PatientsListNurseComponent implements OnInit {
  columns: Column[] = [
    // { key: 'id', label: 'ID', sortable: true },
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'prenom', label: 'Prénom', sortable: true },
    { key: 'sexe', label: 'Sexe', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'telephone', label: 'Téléphone', sortable: true },
  ];

  dataSource: Patient[] = [];

  constructor(private service: PatientsService, private router: Router) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.service.getAll().subscribe((data) => (this.dataSource = data));
  }

  addNew() {
    this.router.navigate(['/dashboard/infirmier/patients/new']);
  }

  edit(row: Patient) {
    this.router.navigate([`/dashboard/infirmier/patients/${row.publicId}/edit`]);
  }

  remove(row: Patient) {
    this.service.delete(row.publicId).subscribe((ok) => {
      if (ok) {
        toast.success('Patient supprimé');
        this.refresh();
      }
    });
  }

  view(row: Patient) {
    // Optionnel: page de détail si nécessaire
  }
}
