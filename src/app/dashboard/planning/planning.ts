import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-planning',
  imports: [DataTableComponent, FormsModule, CommonModule],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class Planning {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'garde', label: 'Garde', sortable: true },
    { key: 'personnel', label: 'Personnel', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentItem: any = null;

  planningForm = {
    description: '',
    garde: '',
    personnel: '',
  };

  // Dropdown states and search
  gardeDropdownOpen = false;
  personnelDropdownOpen = false;
  gardeSearch = '';
  personnelSearch = '';
  gardeActiveIndex = -1;
  personnelActiveIndex = -1;

  // Options sources (placeholder lists; can be wired to services)
  gardesOptions: string[] = ['Garde matin', 'Garde soir', 'Garde nuit'];
  personnelsOptions: string[] = ['Dr. Ndiaye', 'Infirmier Diop', 'Dr. Ba'];

  get filteredGardes() {
    const q = (this.gardeSearch || '').toLowerCase();
    return this.gardesOptions.filter((g) => g.toLowerCase().includes(q));
  }

  get filteredPersonnels() {
    const q = (this.personnelSearch || '').toLowerCase();
    return this.personnelsOptions.filter((p) => p.toLowerCase().includes(q));
  }

  handleNew() {
    this.planningForm = {
      description: '',
      garde: '',
      personnel: '',
    };
    this.gardeSearch = '';
    this.personnelSearch = '';
    this.gardeDropdownOpen = false;
    this.personnelDropdownOpen = false;
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('Actualisation du planning');
  }

  handleEdit(item: any) {
    this.currentItem = item;
    const { description, garde, personnel } = item;
    this.planningForm = { description, garde, personnel };
    this.gardeSearch = '';
    this.personnelSearch = '';
    this.gardeDropdownOpen = false;
    this.personnelDropdownOpen = false;
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
    const newItem = { id: `PLN${Math.floor(Math.random() * 1000)}`, ...this.planningForm };
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

  // Dropdown helpers
  toggleGardeDropdown() {
    this.gardeDropdownOpen = !this.gardeDropdownOpen;
    this.gardeActiveIndex = -1;
  }

  togglePersonnelDropdown() {
    this.personnelDropdownOpen = !this.personnelDropdownOpen;
    this.personnelActiveIndex = -1;
  }

  selectGarde(g: string) {
    this.planningForm.garde = g;
    this.gardeDropdownOpen = false;
  }

  selectPersonnel(p: string) {
    this.planningForm.personnel = p;
    this.personnelDropdownOpen = false;
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
      description: 'Consultation générale du matin',
      garde: 'Garde matin',
      personnel: 'Dr. Ndiaye',
    },
    {
      id: 'PLN002',
      description: 'Garde du soir aux urgences',
      garde: 'Garde soir',
      personnel: 'Infirmier Diop',
    },
    {
      id: 'PLN003',
      description: 'Consultation cardiologie',
      garde: 'Garde matin',
      personnel: 'Dr. Ba',
    },
  ];
}
