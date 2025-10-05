import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DiagnosticsService } from '../diagnostics.service';
import { Diagnostic } from '../../../../core/interfaces/medical';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';

@Component({
  selector: 'app-diagnostics-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  templateUrl: './diagnostics-list.component.html',
  styleUrl: './diagnostics-list.component.css',
})
export class DiagnosticsListComponent implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'maladie', label: 'Maladie', sortable: true },
    { key: 'details', label: 'Détails', sortable: true },
    { key: 'gravite', label: 'Niveau de gravité', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: Array<Diagnostic & { maladie?: string; details?: string; gravite?: string }> = [];

  // Modal de confirmation de suppression
  confirmDeleteOpen = false;
  toDelete: (Diagnostic & { maladie?: string; details?: string; gravite?: string }) | null = null;

  constructor(private service: DiagnosticsService, private router: Router) {}

  ngOnInit(): void { this.refresh(); }
  refresh() {
    this.service.getAll().subscribe((data) => (
      this.dataSource = data.map((d) => ({
        ...d,
        // Fallbacks: map depuis les champs existants si les nouveaux ne sont pas présents
        maladie: (d as any).maladie || d.resultat || '—',
        details: (d as any).details || d.resultat || '—',
        gravite: (d as any).gravite || '—',
      }))
    ));
  }
  addNew() { this.router.navigate(['/dashboard/doctor/diagnostics/new']); }
  edit(row: Diagnostic) {}
  // Ouvre le modal de confirmation au lieu de supprimer directement
  delete(row: Diagnostic & { maladie?: string }) {
    this.toDelete = row;
    this.confirmDeleteOpen = true;
  }

  // Confirme la suppression et rafraîchit la liste
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