import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrdonnancesService } from '../ordonnances.service';
import { Ordonnance, Prescription } from '../../../../core/interfaces/medical';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';
import { PrescriptionsService } from '../../prescriptions/prescriptions.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-ordonnances-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  templateUrl: './ordonnances-list.component.html',
  styleUrl: './ordonnances-list.component.css',
})
export class OrdonnancesListComponent implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'prescriptions', label: 'Prescriptions', sortable: true },
    { key: 'coutTotal', label: 'Coût total', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: Array<Ordonnance & { prescriptions: number }> = [];
  // Confirmation suppression
  showDeleteModal = false;
  deleteTarget: Ordonnance | null = null;
  

  constructor(
    private service: OrdonnancesService,
    private prescriptionsService: PrescriptionsService,
    private router: Router,
  ) {}

  ngOnInit(): void { this.refresh(); }
  refresh() {
    forkJoin({
      ordonnances: this.service.getAll().pipe(catchError(() => of([] as Ordonnance[]))),
      prescriptions: this.prescriptionsService.getAll().pipe(catchError(() => of([] as Prescription[]))),
    }).subscribe(({ ordonnances, prescriptions }) => {
      this.dataSource = (ordonnances as Ordonnance[]).map((o) => {
        const produits = o.produits ?? [];
        const computedTotal = produits.reduce((sum, p) => sum + (p.prixProduit ?? p.cout ?? 0), 0);
        const lib = o.libelle ?? (o as any).contenu ?? 'Sans libellé';
        const total = typeof o.coutTotal === 'number' ? o.coutTotal : computedTotal;
        const prescCount = (prescriptions as Prescription[]).filter((p) => p.patient === o.patient).length;
        return { ...o, libelle: lib, coutTotal: total, prescriptions: prescCount } as Ordonnance & { prescriptions: number };
      });
    });
  }
  addNew() { this.router.navigate(['/dashboard/doctor/ordonnances/new']); }
  edit(row: Ordonnance) {}
  delete(row: Ordonnance) {
    // Ouvre la confirmation avant suppression
    this.deleteTarget = row;
    this.showDeleteModal = true;
  }
  viewDetails(row: Ordonnance) { this.router.navigate(['/dashboard/doctor/ordonnances', row.id]); }

  confirmDelete(): void {
    if (!this.deleteTarget) {
      this.showDeleteModal = false;
      return;
    }
    this.service.delete(this.deleteTarget.id).subscribe(() => {
      this.refresh();
      this.showDeleteModal = false;
      this.deleteTarget = null;
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteTarget = null;
  }
}