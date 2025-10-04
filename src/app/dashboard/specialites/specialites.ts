import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { FormsModule } from '@angular/forms';
import { SpecialitesService } from './specialites.service';
import { Specialite } from '../../core/interfaces/admin';

@Component({
  selector: 'app-specialites',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './specialites.html',
  styleUrl: './specialites.css',
})
export class Specialites {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé spécialité', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'nbPersonnel', label: 'Nombre de personnels associés', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  // Modals visibility
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Current specialite being edited or deleted
  currentSpecialite: any = null;

  // Form model for create/edit
  specialiteForm = {
    libelle: '',
    description: '',
  };

  constructor(private service: SpecialitesService) {}

  specialites: Specialite[] = [];

  private refresh() {
    this.service.getAll().subscribe((data) => (this.specialites = data));
  }

  // Event handlers
  handleNew() {
    this.specialiteForm = { libelle: '', description: '' };
    this.showCreateModal = true;
  }

  handleRefresh() { this.refresh(); }

  handleEdit(specialite: any) {
    this.currentSpecialite = specialite;
    this.specialiteForm = {
      libelle: specialite.libelle,
      description: specialite.description,
    };
    this.showEditModal = true;
  }

  handleDelete(specialite: any) {
    this.currentSpecialite = specialite;
    this.showDeleteModal = true;
  }

  handleRowClick(specialite: any) {
    // Optionally handle row click, e.g. show details
    console.log('Row clicked:', specialite);
  }

  // CRUD operations
  createSpecialite() {
    const { libelle, description } = this.specialiteForm;
    this.service.create({ libelle: libelle!, description: description!, nbPersonnel: 0 }).subscribe(() => {
      toast.success('Spécialité créée avec succès');
      this.showCreateModal = false;
      this.refresh();
    });
  }

  updateSpecialite() {
    if (this.currentSpecialite) {
      const { libelle, description } = this.specialiteForm;
      this.service
        .update(this.currentSpecialite.id, { libelle, description })
        .subscribe(() => {
          toast.success('Spécialité mise à jour avec succès');
          this.showEditModal = false;
          this.refresh();
        });
    } else {
      this.showEditModal = false;
    }
  }

  deleteSpecialite() {
    if (this.currentSpecialite) {
      this.service.delete(this.currentSpecialite.id).subscribe(() => {
        toast.success('Spécialité supprimée avec succès');
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
