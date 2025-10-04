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
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'admissionDate', label: 'Date d’admission', sortable: true },
    { key: 'service', label: 'Service', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: Hospitalisation[] = [];

  constructor(private service: HospitalisationsService, private router: Router) {}

  ngOnInit(): void { this.refresh(); }
  refresh() { this.service.getAll().subscribe((data) => (this.dataSource = data)); }
  addNew() { this.router.navigate(['/dashboard/doctor/hospitalisations/new']); }
  edit(row: Hospitalisation) {}
  delete(row: Hospitalisation) { this.service.delete(row.id).subscribe(() => this.refresh()); }
}