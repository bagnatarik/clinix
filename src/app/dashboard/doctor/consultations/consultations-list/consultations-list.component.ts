import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ConsultationsService } from '../consultations.service';
import { Consultation } from '../../../../core/interfaces/medical';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';

@Component({
  selector: 'app-consultations-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  templateUrl: './consultations-list.component.html',
  styleUrl: './consultations-list.component.css',
})
export class ConsultationsListComponent implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'motif', label: 'Motif', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: Consultation[] = [];

  constructor(private service: ConsultationsService, private router: Router) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.service.getAll().subscribe((data) => (this.dataSource = data));
  }

  addNew() {
    this.router.navigate(['/dashboard/doctor/consultations/new']);
  }

  edit(row: Consultation) {
    this.router.navigate(['/dashboard/doctor/consultations', row.id]);
  }

  delete(row: Consultation) {
    this.service.delete(row.id).subscribe(() => this.refresh());
  }
}