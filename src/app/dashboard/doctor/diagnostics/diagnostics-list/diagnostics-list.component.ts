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
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'resultat', label: 'Résultat', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: Diagnostic[] = [];

  constructor(private service: DiagnosticsService, private router: Router) {}

  ngOnInit(): void { this.refresh(); }
  refresh() { this.service.getAll().subscribe((data) => (this.dataSource = data)); }
  addNew() { this.router.navigate(['/dashboard/doctor/diagnostics/new']); }
  edit(row: Diagnostic) {}
  delete(row: Diagnostic) { this.service.delete(row.id).subscribe(() => this.refresh()); }
}