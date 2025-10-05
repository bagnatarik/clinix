import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';

@Component({
  selector: 'app-traitements-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Suivi traitements</h2>
      </div>

      <app-data-table-component
        [tableName]="'Traitements'"
        [columns]="columns"
        [data]="dataSource"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [newButtonLabel]="'Ajouter traitement'"
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
export class TraitementsListComponent implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'dateDebut', label: 'Date de début', sortable: true },
    { key: 'dateFin', label: 'Date de fin', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'doseJournaliere', label: 'Dose journalière', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  dataSource: Array<{
    id: string;
    dateDebut: string; // ISO date string
    dateFin: string; // ISO date string
    description: string;
    doseJournaliere: string;
  }> = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    // Données mock alignées avec les colonnes demandées
    this.dataSource = [
      {
        id: 'TR-3001',
        dateDebut: '2025-10-10',
        dateFin: '2025-10-15',
        description: 'Antibiotique - infection ORL',
        doseJournaliere: '2 comprimés/jour',
      },
      {
        id: 'TR-3002',
        dateDebut: '2025-10-11',
        dateFin: '2025-10-16',
        description: 'Anti-inflammatoire - douleur lombaire',
        doseJournaliere: '1 dose/jour',
      },
      {
        id: 'TR-3003',
        dateDebut: '2025-10-12',
        dateFin: '2025-10-18',
        description: 'Antalgique - post-opératoire',
        doseJournaliere: '3 prises/jour',
      },
    ];
  }

  addNew() {
    this.router.navigate(['/dashboard/infirmier/traitements/new']);
  }

  edit(row: any) {
    // Pas d’écran d’édition dédié pour l’instant
    this.router.navigate(['/dashboard/infirmier/traitements/new']);
  }

  delete(row: any) {
    // Suppression locale
    this.dataSource = this.dataSource.filter((x) => x.id !== row.id);
  }

  view(row: any) {
    // À implémenter si une page détail existe
  }
}
