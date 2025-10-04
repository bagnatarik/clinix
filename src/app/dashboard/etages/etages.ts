import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-etages',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './etages.html',
  styleUrl: './etages.css'
})
export class Etages {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé étage', sortable: true },
    { key: 'nbChambres', label: 'Nombre de chambres associées', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentEtage: any = null;

  etageForm = {
    id: '',
    libelle: '',
    nbChambres: 0,
  };

  handleNew() {
    this.etageForm = { id: '', libelle: '', nbChambres: 0 };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('Actualisation de la liste des étages');
  }

  handleEdit(etage: any) {
    this.currentEtage = etage;
    this.etageForm = { ...etage };
    this.showEditModal = true;
  }

  handleDelete(etage: any) {
    this.currentEtage = etage;
    this.showDeleteModal = true;
  }

  handleRowClick(etage: any) {
    console.log('Row clicked:', etage);
  }

  createEtage() {
    const newItem = { ...this.etageForm };
    if (!newItem.id) {
      newItem.id = `ETG${Math.floor(Math.random() * 1000)}`;
    }
    this.etages = [newItem, ...this.etages];
    this.showCreateModal = false;
  }

  updateEtage() {
    if (this.currentEtage) {
      const index = this.etages.findIndex((e) => e.id === this.currentEtage.id);
      if (index !== -1) {
        this.etages[index] = { ...this.currentEtage, ...this.etageForm };
      }
    }
    this.showEditModal = false;
  }

  deleteEtage() {
    if (this.currentEtage) {
      this.etages = this.etages.filter((e) => e.id !== this.currentEtage.id);
    }
    this.showDeleteModal = false;
  }

  etages = [
    { id: 'ETG1', libelle: 'Rez-de-chaussée', nbChambres: 12 },
    { id: 'ETG2', libelle: 'Premier étage', nbChambres: 20 },
    { id: 'ETG3', libelle: 'Deuxième étage', nbChambres: 18 },
  ];
}
