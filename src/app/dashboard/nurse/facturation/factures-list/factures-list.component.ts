import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';

@Component({
  selector: 'app-factures-list-nurse',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Historique des factures</h2>
      </div>

      <app-data-table-component
        [tableName]="'Historique des factures'"
        [columns]="columns"
        [data]="rows"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [newButtonLabel]="'Nouvelle facture'"
        [showNewButton]="true"
        (onNew)="addNew()"
        (onRefresh)="refresh()"
        (onEdit)="edit($event)"
        (onDelete)="delete($event)"
        (onRowClick)="view($event)"
      ></app-data-table-component>
    </div>
  `,
})
export class FacturesListNurseComponent {
  constructor(private router: Router) {}

  columns = [
    { key: 'id', label: 'ID' },
    { key: 'patient', label: 'Patient' },
    { key: 'dateFacture', label: 'Date' },
    { key: 'cout', label: 'Coût' },
    { key: 'statut', label: 'Statut' },
    { key: 'actions', label: 'Actions' },
  ];

  rows = [
    { id: 'F-1001', patient: 'Amine B.', dateFacture: '2025-10-03', cout: 1200.0, statut: 'Payée' },
    { id: 'F-1002', patient: 'Meriem L.', dateFacture: '2025-10-04', cout: 850.5, statut: 'En attente' },
  ];

  refresh() {}
  addNew() { this.router.navigate(['/dashboard/infirmier/facturation/new']); }
  edit(row: any) { this.router.navigate(['/dashboard/infirmier/facturation', row.id]); }
  delete(row: any) {}
  view(row: any) { this.router.navigate(['/dashboard/infirmier/facturation', row.id]); }
}