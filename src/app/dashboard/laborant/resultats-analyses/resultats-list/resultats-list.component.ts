import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';

@Component({
  selector: 'app-resultats-list-laborant',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Résultats d’analyses</h2>
      </div>

      <app-data-table-component
        [tableName]="'Résultats d’analyses'"
        [columns]="columns"
        [data]="rows"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [newButtonLabel]="'Publier un résultat'"
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
export class ResultatsListLaborantComponent {
  constructor(private router: Router) {}

  columns = [
    { key: 'id', label: 'ID' },
    { key: 'patient', label: 'Patient' },
    { key: 'analyse', label: 'Analyse' },
    { key: 'date', label: 'Date' },
    { key: 'statut', label: 'Statut' },
    { key: 'actions', label: 'Actions' },
  ];

  rows = [
    { id: 'RA-2201', patient: 'Amine B.', analyse: 'Hémogramme', date: '2025-10-03', statut: 'Validé' },
    { id: 'RA-2202', patient: 'Meriem L.', analyse: 'Glycémie', date: '2025-10-04', statut: 'En attente' },
  ];

  refresh() {}
  addNew() { this.router.navigate(['/dashboard/laborant/resultats-analyses/new']); }
  edit(row: any) { this.router.navigate(['/dashboard/laborant/resultats-analyses', row.id]); }
  delete(row: any) {}
  view(row: any) { this.router.navigate(['/dashboard/laborant/resultats-analyses', row.id]); }
}