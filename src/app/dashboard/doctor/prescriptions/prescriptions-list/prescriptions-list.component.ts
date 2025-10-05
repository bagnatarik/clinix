import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PrescriptionsService } from '../prescriptions.service';
import { Prescription } from '../../../../core/interfaces/medical';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';

@Component({
  selector: 'app-prescriptions-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  templateUrl: './prescriptions-list.component.html',
  styleUrl: './prescriptions-list.component.css',
})
export class PrescriptionsListComponent implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'date', label: 'Date prescription', sortable: true },
    { key: 'motif', label: 'Motif', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: Array<Prescription & { motif?: string; description?: string }> = [];
  // Confirmation suppression
  showDeleteModal = false;
  deleteTarget: Prescription | null = null;

  constructor(private service: PrescriptionsService, private router: Router) {}

  ngOnInit(): void { this.refresh(); }

  refresh() {
    this.service.getAll().subscribe((data) => {
      this.dataSource = data.map((p) => ({
        ...p,
        motif: (p.motif && p.motif.trim())
          ? p.motif
          : (p.details && p.details.trim())
            ? p.details.split('\n')[0]
            : '—',
        description: (p.description && p.description.trim()) ? p.description : p.details,
      }));
    });
  }
  addNew() { this.router.navigate(['/dashboard/doctor/prescriptions/new']); }
  edit(row: Prescription) { this.router.navigate(['/dashboard/doctor/prescriptions', row.id]); }
  viewDetails(row: Prescription) { this.router.navigate(['/dashboard/doctor/prescriptions', row.id]); }
  delete(row: Prescription) {
    // Ouvre la confirmation avant suppression
    this.deleteTarget = row;
    this.showDeleteModal = true;
  }
  confirmDelete() {
    if (!this.deleteTarget) { this.showDeleteModal = false; return; }
    this.service.delete(this.deleteTarget.id).subscribe(() => {
      this.showDeleteModal = false;
      this.deleteTarget = null;
      this.refresh();
    });
  }
  cancelDelete() {
    this.showDeleteModal = false;
    this.deleteTarget = null;
  }
}