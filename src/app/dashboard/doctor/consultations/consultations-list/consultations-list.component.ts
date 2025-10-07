import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ConsultationsService } from '../consultations.service';
import { ConsultationResponse } from '../../../../core/interfaces/medical';
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
    // { key: 'publicId', label: 'ID', sortable: true },
    { key: 'consultationDate', label: 'Date', sortable: true },
    { key: 'consultationType', label: 'Type consultation', sortable: true },
    { key: 'consultationDescription', label: 'Description', sortable: true },
    { key: 'consultationStatus', label: 'Statut', sortable: true },
    { key: 'coutConsultation', label: 'Coût', sortable: true },
    { key: 'poids', label: 'Poids', sortable: true },
    { key: 'temperature', label: 'Température', sortable: true },
    { key: 'tension', label: 'Tension', sortable: true },
    { key: 'codeDossierPatient', label: 'Code dossier patient', sortable: true },
    { key: 'nomPersonnel', label: 'Personnel', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  dataSource: ConsultationResponse[] = [];
  confirmDeleteOpen = false;
  rowToDelete?: ConsultationResponse;

  constructor(private service: ConsultationsService, private router: Router) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.service.getAllV2().subscribe((data) => (this.dataSource = data));
  }

  addNew() {
    this.router.navigate(['/dashboard/doctor/consultations/new']);
  }

  edit(row: ConsultationResponse) {
    this.router.navigate(['/dashboard/doctor/consultations', row.publicId]);
  }

  delete(row: ConsultationResponse) {
    this.rowToDelete = row;
    this.confirmDeleteOpen = true;
  }

  confirmDelete() {
    if (!this.rowToDelete) return;
    this.service.deleteByPublicId(this.rowToDelete.publicId).subscribe(() => {
      this.confirmDeleteOpen = false;
      this.rowToDelete = undefined;
      this.refresh();
    });
  }

  cancelDelete() {
    this.confirmDeleteOpen = false;
    this.rowToDelete = undefined;
  }
}
