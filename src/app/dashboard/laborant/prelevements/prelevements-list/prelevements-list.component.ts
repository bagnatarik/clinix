import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';

@Component({
  selector: 'app-prelevements-list-laborant',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Historique prélèvements</h2>
      </div>

      <app-data-table-component
        [tableName]="'Historique prélèvements'"
        [columns]="columns"
        [data]="rows"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [newButtonLabel]="'Nouveau prélèvement'"
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
export class PrelevementsListLaborantComponent {
  constructor(private router: Router) {}

  columns = [
    { key: 'id', label: 'ID' },
    { key: 'patient', label: 'Patient' },
    { key: 'date', label: 'Date de prélèvement' },
    { key: 'type', label: 'Type' },
    { key: 'statut', label: 'Statut' },
    { key: 'actions', label: 'Actions' },
  ];

  rows = [
    { id: 'PR-1001', patient: 'Amine B.', date: '2025-10-01', type: 'Sanguin', statut: 'Reçu' },
    { id: 'PR-1002', patient: 'Meriem L.', date: '2025-10-02', type: 'Urine', statut: 'En attente' },
  ];

  refresh() {}
  addNew() { this.router.navigate(['/dashboard/laborant/prelevements/new']); }
  edit(row: any) { this.router.navigate(['/dashboard/laborant/prelevements', row.id]); }
  delete(row: any) {}
  view(row: any) { this.router.navigate(['/dashboard/laborant/prelevements', row.id]); }
}