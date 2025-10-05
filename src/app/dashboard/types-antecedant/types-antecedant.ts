import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-types-antecedant',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './types-antecedant.html',
  styleUrl: './types-antecedant.css'
})
export class TypesAntecedant {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentType: any = null;

  typeForm = {
    libelle: '',
  };

  handleNew() {
    this.typeForm = { libelle: '' };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('Actualisation des types d’antécédant');
  }

  handleEdit(type: any) {
    this.currentType = type;
    this.typeForm = { libelle: type.libelle };
    this.showEditModal = true;
  }

  handleDelete(type: any) {
    this.currentType = type;
    this.showDeleteModal = true;
  }

  handleRowClick(type: any) {
    console.log('Row clicked:', type);
  }

  createType() {
    const newItem = {
      id: `TAN${Math.floor(Math.random() * 1000)}`,
      libelle: this.typeForm.libelle
    };
    this.typesAntecedant = [newItem, ...this.typesAntecedant];
    this.showCreateModal = false;
  }

  updateType() {
    if (this.currentType) {
      const index = this.typesAntecedant.findIndex((t) => t.id === this.currentType.id);
      if (index !== -1) this.typesAntecedant[index] = { ...this.currentType, ...this.typeForm };
    }
    this.showEditModal = false;
  }

  deleteType() {
    if (this.currentType) {
      this.typesAntecedant = this.typesAntecedant.filter((t) => t.id !== this.currentType.id);
    }
    this.showDeleteModal = false;
  }

  typesAntecedant = [
    { id: 'TAN001', libelle: 'Allergie' },
    { id: 'TAN002', libelle: 'Chirurgie' },
    { id: 'TAN003', libelle: 'Maladie chronique' },
  ];
}
