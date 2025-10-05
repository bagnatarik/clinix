import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-gardes',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './gardes.html',
  styleUrl: './gardes.css',
})
export class Gardes {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'dateDebut', label: 'Date début', sortable: true },
    { key: 'heureDebut', label: 'Heure début', sortable: true },
    { key: 'dateFin', label: 'Date fin', sortable: true },
    { key: 'heureFin', label: 'Heure fin', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentGarde: any = null;

  gardeForm = {
    id: '',
    dateDebut: '',
    heureDebut: '',
    dateFin: '',
    heureFin: '',
  };

  handleNew() {
    this.gardeForm = {
      id: '',
      dateDebut: '',
      heureDebut: '',
      dateFin: '',
      heureFin: '',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('Actualisation des gardes');
  }

  handleEdit(garde: any) {
    this.currentGarde = garde;
    this.gardeForm = {
      id: garde.id ?? '',
      dateDebut: garde.dateDebut ?? '',
      heureDebut: garde.heureDebut ?? '',
      dateFin: garde.dateFin ?? '',
      heureFin: garde.heureFin ?? '',
    };
    this.showEditModal = true;
  }

  handleDelete(garde: any) {
    this.currentGarde = garde;
    this.showDeleteModal = true;
  }

  handleRowClick(garde: any) {
    console.log('Row clicked:', garde);
  }

  createGarde() {
    const newItem = {
      id: `GRD${Math.floor(Math.random() * 1000)}`,
      dateDebut: this.gardeForm.dateDebut,
      heureDebut: this.gardeForm.heureDebut,
      dateFin: this.gardeForm.dateFin,
      heureFin: this.gardeForm.heureFin,
    };
    this.gardes = [newItem, ...this.gardes];
    this.showCreateModal = false;
  }

  updateGarde() {
    if (this.currentGarde) {
      const index = this.gardes.findIndex((t) => t.id === this.currentGarde.id);
      if (index !== -1)
        this.gardes[index] = {
          ...this.currentGarde,
          dateDebut: this.gardeForm.dateDebut,
          heureDebut: this.gardeForm.heureDebut,
          dateFin: this.gardeForm.dateFin,
          heureFin: this.gardeForm.heureFin,
        };
    }
    this.showEditModal = false;
  }

  deleteGarde() {
    if (this.currentGarde) {
      this.gardes = this.gardes.filter((t) => t.id !== this.currentGarde.id);
    }
    this.showDeleteModal = false;
  }

  gardes = [
    {
      id: 'GRD001',
      dateDebut: '2025-10-04',
      heureDebut: '08:00',
      dateFin: '2025-10-04',
      heureFin: '16:00',
    },
    {
      id: 'GRD002',
      dateDebut: '2025-10-05',
      heureDebut: '16:00',
      dateFin: '2025-10-06',
      heureFin: '00:00',
    },
    {
      id: 'GRD003',
      dateDebut: '2025-10-06',
      heureDebut: '00:00',
      dateFin: '2025-10-06',
      heureFin: '08:00',
    },
  ];
}
