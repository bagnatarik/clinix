import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-planning',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class Planning {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'dateDebut', label: 'Date début', sortable: true },
    { key: 'dateFin', label: 'Date fin', sortable: true },
    { key: 'personnel', label: 'Personnel assigné', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentItem: any = null;

  planningForm = {
    id: '',
    dateDebut: '',
    dateFin: '',
    personnel: '',
    type: 'consultation',
  };

  handleNew() {
    this.planningForm = {
      id: '',
      dateDebut: '',
      dateFin: '',
      personnel: '',
      type: 'consultation',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('Actualisation du planning');
  }

  handleEdit(item: any) {
    this.currentItem = item;
    this.planningForm = { ...item };
    this.showEditModal = true;
  }

  handleDelete(item: any) {
    this.currentItem = item;
    this.showDeleteModal = true;
  }

  handleRowClick(item: any) {
    console.log('Row clicked:', item);
  }

  createPlanningItem() {
    const newItem = { ...this.planningForm };
    if (!newItem.id) newItem.id = `PLN${Math.floor(Math.random() * 1000)}`;
    this.planning = [newItem, ...this.planning];
    this.showCreateModal = false;
  }

  updatePlanningItem() {
    if (this.currentItem) {
      const index = this.planning.findIndex((t) => t.id === this.currentItem.id);
      if (index !== -1) this.planning[index] = { ...this.currentItem, ...this.planningForm };
    }
    this.showEditModal = false;
  }

  deletePlanningItem() {
    if (this.currentItem) {
      this.planning = this.planning.filter((t) => t.id !== this.currentItem.id);
    }
    this.showDeleteModal = false;
  }

  planning = [
    {
      id: 'PLN001',
      dateDebut: '2025-10-07 08:00',
      dateFin: '2025-10-07 12:00',
      personnel: 'Dr. Ndiaye',
      type: 'consultation',
    },
    {
      id: 'PLN002',
      dateDebut: '2025-10-07 16:00',
      dateFin: '2025-10-07 20:00',
      personnel: 'Infirmier Diop',
      type: 'garde',
    },
    {
      id: 'PLN003',
      dateDebut: '2025-10-08 08:00',
      dateFin: '2025-10-08 10:00',
      personnel: 'Dr. Ba',
      type: 'consultation',
    },
  ];
}
