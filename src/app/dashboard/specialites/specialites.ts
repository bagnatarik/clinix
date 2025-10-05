import { Component, OnInit } from '@angular/core';
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
export class Specialites implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
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
  };

  constructor(private service: SpecialitesService) {}

  ngOnInit() {
    this.refresh();
  }

  specialites: Specialite[] = [];

  private refresh() {
    this.service.getAll().subscribe((data) => (this.specialites = data));
  }

  // Event handlers
  handleNew() {
    this.specialiteForm = { libelle: '' };
    this.showCreateModal = true;
  }

  handleRefresh() { this.refresh(); }

  handleEdit(specialite: any) {
    this.currentSpecialite = specialite;
    this.specialiteForm = { libelle: specialite.libelle };
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
    const { libelle } = this.specialiteForm;
    // L'id est généré côté backend; on n'envoie que le libellé
    // Description par défaut vide pour compatibilité avec le service
    this.service.create({ libelle: libelle!, description: '', nbPersonnel: 0 }).subscribe(() => {
      toast.success('Spécialité créée avec succès');
      this.showCreateModal = false;
      this.refresh();
    });
  }

  updateSpecialite() {
    if (this.currentSpecialite) {
      const { libelle } = this.specialiteForm;
      this.service
        .update(this.currentSpecialite.id, { libelle })
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
