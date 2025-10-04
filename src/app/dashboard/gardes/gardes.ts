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
    { key: 'personnel', label: 'Personnel', sortable: true },
    { key: 'departement', label: 'Département', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'heureDebut', label: 'Heure début', sortable: true },
    { key: 'heureFin', label: 'Heure fin', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentGarde: any = null;

  gardeForm = {
    id: '',
    personnel: '',
    departement: '',
    date: '',
    heureDebut: '',
    heureFin: '',
    statut: 'planifiée',
  };

  handleNew() {
    this.gardeForm = {
      id: '',
      personnel: '',
      departement: '',
      date: '',
      heureDebut: '',
      heureFin: '',
      statut: 'planifiée',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('Actualisation des gardes');
  }

  handleEdit(garde: any) {
    this.currentGarde = garde;
    this.gardeForm = { ...garde };
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
    const newItem = { ...this.gardeForm };
    if (!newItem.id) newItem.id = `GRD${Math.floor(Math.random() * 1000)}`;
    this.gardes = [newItem, ...this.gardes];
    this.showCreateModal = false;
  }

  updateGarde() {
    if (this.currentGarde) {
      const index = this.gardes.findIndex((t) => t.id === this.currentGarde.id);
      if (index !== -1) this.gardes[index] = { ...this.currentGarde, ...this.gardeForm };
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
      personnel: 'Dr. Ndiaye',
      departement: 'Urgences',
      date: '2025-10-04',
      heureDebut: '08:00',
      heureFin: '16:00',
      statut: 'planifiée',
    },
    {
      id: 'GRD002',
      personnel: 'Infirmier Diop',
      departement: 'Cardiologie',
      date: '2025-10-05',
      heureDebut: '16:00',
      heureFin: '00:00',
      statut: 'terminée',
    },
    {
      id: 'GRD003',
      personnel: 'Dr. Ba',
      departement: 'Oncologie',
      date: '2025-10-06',
      heureDebut: '00:00',
      heureFin: '08:00',
      statut: 'en cours',
    },
  ];
}
