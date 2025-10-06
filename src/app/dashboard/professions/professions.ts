import { Component, OnInit } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { FormsModule } from '@angular/forms';
import { ProfessionsService } from './professions.service';
import { Profession } from '../../core/interfaces/admin';

@Component({
  selector: 'app-professions',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './professions.html',
  styleUrl: './professions.css',
})
export class Professions implements OnInit {
  columns: Column[] = [
    // { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé profession', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  // Modals visibility
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Current profession being edited or deleted
  currentProfession: any = null;

  // Form model for create/edit
  professionForm = {
    libelle: '',
  };

  constructor(private service: ProfessionsService) {}

  professions: Profession[] = [];

  private refresh() {
    this.service.getAll().subscribe((data) => (this.professions = data));
  }

  ngOnInit(): void {
    this.refresh();
  }

  // Event handlers
  handleNew() {
    this.professionForm = { libelle: '' };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(profession: any) {
    this.currentProfession = profession;
    this.professionForm = {
      libelle: profession.libelle,
    };
    this.showEditModal = true;
  }

  handleDelete(profession: any) {
    this.currentProfession = profession;
    this.showDeleteModal = true;
  }

  handleRowClick(profession: any) {
    // Optionally handle row click, e.g. show details
    console.log('Row clicked:', profession);
  }

  // CRUD operations
  createProfession() {
    const { libelle } = this.professionForm;
    this.service.create(libelle!).subscribe(() => {
      toast.success('Profession créée avec succès');
      this.showCreateModal = false;
      this.refresh();
    });
  }

  updateProfession() {
    if (this.currentProfession) {
      const { libelle } = this.professionForm;
      this.service.update(this.currentProfession.publicId, { libelle }).subscribe(() => {
        toast.success('Profession mise à jour avec succès');
        this.showEditModal = false;
        this.refresh();
      });
    } else {
      this.showEditModal = false;
    }
  }

  deleteProfession() {
    if (this.currentProfession) {
      this.service.delete(this.currentProfession.publicId).subscribe(() => {
        toast.success('Profession supprimée avec succès');
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
