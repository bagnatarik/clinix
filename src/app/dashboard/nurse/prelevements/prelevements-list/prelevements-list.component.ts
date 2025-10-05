import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';

@Component({
  selector: 'app-prelevements-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Mes prélèvements</h2>
      </div>

      <app-data-table-component
        [tableName]="'Prélèvements'"
        [columns]="columns"
        [data]="dataSource"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [newButtonLabel]="'Nouveau prélèvement'"
        [showNewButton]="true"
        (onNew)="addNew()"
        (onRefresh)="refresh()"
      ></app-data-table-component>
    </div>
  `,
})
export class PrelevementsListComponent implements OnInit {
  columns: Column[] = [
    { key: 'date', label: 'Date de prélèvement', sortable: true },
    { key: 'quantite', label: 'Quantité prélevée', sortable: true },
    { key: 'type', label: 'Type de prélèvement', sortable: true },
    { key: 'analyse', label: 'Analyse médicale', sortable: true },
  ];

  dataSource: Array<{
    date: string; // ISO date string
    quantite: number | string;
    type: string;
    analyse: string;
  }> = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    // Données mock alignées avec les colonnes demandées
    this.dataSource = [
      { date: '2025-10-01', quantite: '5 ml', type: 'Sanguin', analyse: 'Hémogramme' },
      {
        date: '2025-10-02',
        quantite: '20 ml',
        type: 'Urinaire',
        analyse: 'Culture bactériologique',
      },
      { date: '2025-10-03', quantite: '2 ml', type: 'Salivaire', analyse: 'PCR' },
    ];
  }

  addNew() {
    this.router.navigate(['/dashboard/infirmier/prelevements/new']);
  }

  // Plus d’actions par ligne pour cette vue, les colonnes sont réduites.
}
