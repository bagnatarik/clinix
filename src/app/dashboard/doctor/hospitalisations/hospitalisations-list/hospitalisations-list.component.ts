import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HospitalisationsService } from '../hospitalisations.service';
import { Hospitalisation } from '../../../../core/interfaces/medical';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';

@Component({
  selector: 'app-hospitalisations-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  templateUrl: './hospitalisations-list.component.html',
  styleUrl: './hospitalisations-list.component.css',
})
export class HospitalisationsListComponent implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'admissionDate', label: 'Date d’admission', sortable: true },
    { key: 'dischargeDate', label: 'Date de sortie', sortable: true },
    { key: 'motif', label: 'Motif', sortable: true },
    { key: 'chambre', label: 'Chambre', sortable: true },
    { key: 'typeChambre', label: 'Type de chambre', sortable: true },
    { key: 'etage', label: 'Étage', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: Hospitalisation[] = [];

  // Modal de confirmation de suppression
  confirmDeleteOpen = false;
  toDelete: Hospitalisation | null = null;

  constructor(private service: HospitalisationsService, private router: Router) {}

  ngOnInit(): void { this.refresh(); }
  refresh() { this.service.getAll().subscribe((data) => (this.dataSource = data)); }
  addNew() { this.router.navigate(['/dashboard/doctor/hospitalisations/new']); }
  edit(row: Hospitalisation) {}
  // Ouvre le modal au lieu de supprimer directement
  delete(row: Hospitalisation) {
    this.toDelete = row;
    this.confirmDeleteOpen = true;
  }

  // Confirme la suppression et rafraîchit
  confirmDelete() {
    if (!this.toDelete) return;
    this.service.delete(this.toDelete.id).subscribe(() => {
      this.confirmDeleteOpen = false;
      this.toDelete = null;
      this.refresh();
    });
  }

  // Annule la suppression
  cancelDelete() {
    this.confirmDeleteOpen = false;
    this.toDelete = null;
  }
}