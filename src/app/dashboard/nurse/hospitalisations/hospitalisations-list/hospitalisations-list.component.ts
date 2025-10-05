import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';
import { Hospitalisation } from '../../../../core/interfaces/medical';
import { HospitalisationsService } from '../../../doctor/hospitalisations/hospitalisations.service';

@Component({
  selector: 'app-hospitalisations-list-nurse',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Mes hospitalisations</h2>
      </div>

      <app-data-table-component
        [tableName]="'Hospitalisations'"
        [columns]="columns"
        [data]="dataSource"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [newButtonLabel]="'Attribuer chambre'"
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
export class HospitalisationsListNurseComponent implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'admissionDate', label: 'Date d’admission', sortable: true },
    { key: 'dischargeDate', label: 'Date de sortie', sortable: true },
    { key: 'motif', label: 'Motif', sortable: true },
    { key: 'diagnostique', label: 'Diagnostique', sortable: true },
    { key: 'chambre', label: 'Chambre', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  dataSource: Hospitalisation[] = [];

  constructor(private service: HospitalisationsService, private router: Router) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.service.getAll().subscribe((data) => (this.dataSource = data));
  }

  addNew() {
    this.router.navigate(['/dashboard/infirmier/hospitalisations/new']);
  }

  edit(row: Hospitalisation) {
    // Pour l’instant, pas d’écran d’édition dédié côté infirmier
    this.router.navigate(['/dashboard/infirmier/hospitalisations/new']);
  }

  delete(row: Hospitalisation) {
    this.service.delete(row.id).subscribe(() => this.refresh());
  }

  view(row: Hospitalisation) {
    // S’il y a une page de détail à l’avenir, on pourra y naviguer
  }
}
