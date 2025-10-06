import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { OrdonnancesService } from '../../dashboard/doctor/ordonnances/ordonnances.service';

@Component({
  selector: 'app-patient-ordonnances-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Mes ordonnances</h2>
      </div>

      <app-data-table-component
        [tableName]="'Ordonnances'"
        [columns]="columns"
        [data]="rows"
        [searchable]="true"
        [paginated]="true"
        [itemsPerPage]="10"
        [showNewButton]="false"
        [showViewButton]="true"
        [showEditButton]="false"
        [showDeleteButton]="false"
        [canViewRow]="canViewRow"
        (onRefresh)="refresh()"
        (onView)="view($event)"
      ></app-data-table-component>

      <div class="text-xs text-gray-600" *ngIf="!loading && rows.length === 0">
        Aucune ordonnance signée trouvée pour votre compte.
      </div>
    </div>
  `,
})
export class PatientOrdonnancesList implements OnInit {
  columns: Column[] = [
    // { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'coutTotal', label: 'Coût total', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  rows: any[] = [];
  loading = false;
  private patientName = '';

  constructor(
    private auth: AuthenticationService,
    private ordonnancesService: OrdonnancesService,
    private router: Router
  ) {
    this.patientName = this.auth.getCurrentUser()?.name ?? 'Patient User';
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.ordonnancesService.getAll().subscribe((list) => {
      const ordos = list || [];
      this.rows = ordos
        .filter((o) => o.patient === this.patientName)
        .filter((o) => {
          const s = (o.statut || '').toLowerCase();
          return s === 'signée' || s === 'signé';
        })
        .map((o: any) => ({
          ...o,
          libelle: o.libelle ?? o.contenu ?? '—',
          coutTotal:
            typeof o.coutTotal === 'number'
              ? o.coutTotal
              : (o.produits || []).reduce(
                  (sum: number, p: any) => sum + (p.prixProduit ?? p.cout ?? 0),
                  0
                ),
        }));
      this.loading = false;
    });
  }

  canViewRow = (row: any) => (row?.statut || '').toLowerCase() === 'signée';

  view(row: any) {
    // Navigue vers la page de détails de l’ordonnance côté patient
    this.router.navigate(['/patient/ordonnances', row.id]);
  }
}
