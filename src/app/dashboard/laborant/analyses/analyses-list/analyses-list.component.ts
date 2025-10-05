import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';

@Component({
  selector: 'app-analyses-list-laborant',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DataTableComponent],
  template: `
    <div class="bg-white border border-neutral-300 rounded p-4 mb-4">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Recherche</label>
            <input [(ngModel)]="filters.search" (input)="refresh()" type="text" placeholder="Nom patient, type..."
                   class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Statut</label>
            <select [(ngModel)]="filters.statut" (change)="refresh()"
                    class="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
              <option value="">Tous</option>
              <option value="En attente">En attente</option>
              <option value="Validée">Validée</option>
              <option value="En cours">En cours</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Type d'analyse</label>
            <select [(ngModel)]="filters.type" (change)="refresh()"
                    class="w-full border border-neutral-300 rounded px-3 py-2 text-sm">
              <option value="">Tous</option>
              <option value="Hémogramme">Hémogramme</option>
              <option value="Glycémie">Glycémie</option>
              <option value="Bilan lipidique">Bilan lipidique</option>
            </select>
          </div>
        </div>
        <div class="flex gap-2">
          <button (click)="exportCsv()" class="px-4 py-2 border border-gray-600 text-gray-700 rounded text-sm hover:bg-gray-600 hover:text-white">Exporter CSV</button>
          <button (click)="addNew()" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Nouvelle analyse</button>
        </div>
      </div>
    </div>

    <app-data-table-component
      [columns]="columns"
      [data]="filteredData"
      [tableName]="'Analyses'"
      [newButtonLabel]="'Nouvelle analyse'"
      [showNewButton]="false"
      (onEdit)="edit($event)"
      (onDelete)="delete($event)"
      (onRefresh)="refresh()"
      (onRowClick)="view($event)"
    ></app-data-table-component>
  `,
})
export class AnalysesListLaborantComponent {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'datePrelevement', label: 'Date prélèvement', sortable: true },
    { key: 'type', label: "Type d'analyse", sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  dataSource: any[] = [
    { id: 1, patient: 'John Doe', datePrelevement: '2025-09-01', type: 'Hémogramme', statut: 'En attente' },
    { id: 2, patient: 'Jane Smith', datePrelevement: '2025-09-03', type: 'Glycémie', statut: 'Validée' },
    { id: 3, patient: 'Alex Martin', datePrelevement: '2025-09-06', type: 'Bilan lipidique', statut: 'En cours' },
  ];

  filteredData: any[] = [...this.dataSource];
  filters = { search: '', statut: '', type: '' };

  constructor(private router: Router) {}

  refresh() {
    const s = this.filters.search.trim().toLowerCase();
    const st = this.filters.statut;
    const tp = this.filters.type;

    this.filteredData = this.dataSource.filter((row) => {
      const matchSearch = !s || `${row.patient} ${row.type}`.toLowerCase().includes(s);
      const matchStatus = !st || row.statut === st;
      const matchType = !tp || row.type === tp;
      return matchSearch && matchStatus && matchType;
    });
  }
  addNew() { this.router.navigate(['/dashboard/laborant/analyses/new']); }
  edit(row: any) { this.router.navigate(['/dashboard/laborant/analyses', row.id]); }
  delete(row: any) { /* TODO: brancher service et supprimer */ }
  view(row: any) { this.router.navigate(['/dashboard/laborant/analyses', row.id]); }

  exportCsv() {
    const headers = this.columns.map((c) => c.key);
    const rows = this.filteredData.map((r) => headers.map((h) => r[h]));
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analyses.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}