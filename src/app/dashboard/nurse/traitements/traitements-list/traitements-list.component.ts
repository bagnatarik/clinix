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
  // Définition locale du type Traitement (pour affichage liste)
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'debut', label: 'Date de début', sortable: true },
    { key: 'traitement', label: 'Traitement', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  dataSource: Array<{
    id: string;
    patient: string;
    debut: string; // ISO date string
    traitement: string;
    statut: 'en cours' | 'terminé' | 'annulé';
  }> = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    // Données mock pour la vue infirmier
    this.dataSource = [
      { id: 'TR-2001', patient: 'Alice Dubois', debut: '2025-10-01', traitement: 'Antibiotique', statut: 'en cours' },
      { id: 'TR-2002', patient: 'Jean Dupont', debut: '2025-10-02', traitement: 'Antalgique', statut: 'terminé' },
      { id: 'TR-2003', patient: 'Sophie Martin', debut: '2025-10-03', traitement: 'Anti-inflammatoire', statut: 'en cours' },
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