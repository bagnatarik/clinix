import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-antecedants',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './antecedants.html',
  styleUrl: './antecedants.css'
})
export class Antecedants {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'type', label: 'Type d’antécédent', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentItem: any = null;

  typesDisponibles = [
    { id: 'TAN001', libelle: 'Allergie' },
    { id: 'TAN002', libelle: 'Chirurgie' },
    { id: 'TAN003', libelle: 'Maladie chronique' },
  ];

  antecedantForm = {
    id: '',
    description: '',
    type: 'Allergie',
  };

  handleNew() {
    this.antecedantForm = {
      id: '',
      description: '',
      type: this.typesDisponibles[0]?.libelle || 'Allergie',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('Actualisation des antécédants');
  }

  handleEdit(item: any) {
    this.currentItem = item;
    this.antecedantForm = { ...item };
    this.showEditModal = true;
  }

  handleDelete(item: any) {
    this.currentItem = item;
    this.showDeleteModal = true;
  }

  handleRowClick(item: any) {
    console.log('Row clicked:', item);
  }

  createAntecedant() {
    const newItem = { ...this.antecedantForm };
    if (!newItem.id) newItem.id = `ANT${Math.floor(Math.random() * 1000)}`;
    this.antecedants = [newItem, ...this.antecedants];
    this.showCreateModal = false;
  }

  updateAntecedant() {
    if (this.currentItem) {
      const index = this.antecedants.findIndex((t) => t.id === this.currentItem.id);
      if (index !== -1) this.antecedants[index] = { ...this.currentItem, ...this.antecedantForm };
    }
    this.showEditModal = false;
  }

  deleteAntecedant() {
    if (this.currentItem) {
      this.antecedants = this.antecedants.filter((t) => t.id !== this.currentItem.id);
    }
    this.showDeleteModal = false;
  }

  antecedants = [
    { id: 'ANT001', description: 'Allergie au pollen', type: 'Allergie' },
    { id: 'ANT002', description: 'Chirurgie appendicectomie en 2019', type: 'Chirurgie' },
    { id: 'ANT003', description: 'Asthme léger', type: 'Maladie chronique' },
  ];
}
