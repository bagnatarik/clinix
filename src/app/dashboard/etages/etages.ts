import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';
import { EtagesService } from './etages.service';
import { Etage } from '../../core/interfaces/admin';

@Component({
  selector: 'app-etages',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './etages.html',
  styleUrl: './etages.css',
})
export class Etages implements OnInit {
  columns: Column[] = [
    // { key: 'publicId', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé étage', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentEtage: Etage | null = null;

  etageForm = {
    libelle: '',
  };

  constructor(private service: EtagesService) {}

  ngOnInit(): void {
    this.refresh();
  }

  etages: Etage[] = [];

  handleNew() {
    this.etageForm = { libelle: '' };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(etage: any) {
    this.currentEtage = etage;
    this.etageForm = { libelle: (etage as Etage).libelle };
    this.showEditModal = true;
  }

  handleDelete(etage: any) {
    this.currentEtage = etage;
    this.showDeleteModal = true;
  }

  handleRowClick(etage: any) {
    console.log('Row clicked:', etage);
  }

  private refresh() {
    this.service.getAll().subscribe({
      next: (data) => (this.etages = data),
      error: () => toast.error('Erreur lors du chargement des étages'),
    });
  }

  createEtage() {
    const { libelle } = this.etageForm;
    this.service.create(libelle!).subscribe(() => {
      toast.success("Étage créé avec succès");
      this.showCreateModal = false;
      this.refresh();
    });
  }

  updateEtage() {
    if (this.currentEtage) {
      const { libelle } = this.etageForm;
      this.service.update(this.currentEtage.publicId, { libelle }).subscribe(() => {
        toast.success("Étage mis à jour avec succès");
        this.showEditModal = false;
        this.refresh();
      });
    } else {
      this.showEditModal = false;
    }
  }

  deleteEtage() {
    if (this.currentEtage) {
      this.service.delete(this.currentEtage.publicId).subscribe(() => {
        toast.success('Étage supprimé avec succès');
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
