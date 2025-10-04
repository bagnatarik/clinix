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
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'details', label: 'Détails', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: Prescription[] = [];

  constructor(private service: PrescriptionsService, private router: Router) {}

  ngOnInit(): void { this.refresh(); }

  refresh() { this.service.getAll().subscribe((data) => (this.dataSource = data)); }
  addNew() { this.router.navigate(['/dashboard/doctor/prescriptions/new']); }
  edit(row: Prescription) {}
  delete(row: Prescription) { this.service.delete(row.id).subscribe(() => this.refresh()); }
}