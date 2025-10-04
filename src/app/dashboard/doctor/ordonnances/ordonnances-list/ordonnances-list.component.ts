import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrdonnancesService } from '../ordonnances.service';
import { Ordonnance } from '../../../../core/interfaces/medical';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';

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
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'contenu', label: 'Contenu', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: Ordonnance[] = [];

  constructor(private service: OrdonnancesService, private router: Router) {}

  ngOnInit(): void { this.refresh(); }
  refresh() { this.service.getAll().subscribe((data) => (this.dataSource = data)); }
  addNew() { this.router.navigate(['/dashboard/doctor/ordonnances/new']); }
  edit(row: Ordonnance) {}
  delete(row: Ordonnance) { this.service.delete(row.id).subscribe(() => this.refresh()); }
}