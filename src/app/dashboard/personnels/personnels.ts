import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { FormsModule } from '@angular/forms';
import { PersonnelsService } from './personnels.service';
import { Personnel } from '../../core/interfaces/admin';

@Component({
  selector: 'app-personnels',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './personnels.html',
  styleUrl: './personnels.css',
})
export class Personnels {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'prenom', label: 'Prénom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'telephone', label: 'Téléphone', sortable: true },
    { key: 'specialite', label: 'Spécialité', sortable: true },
    { key: 'departement', label: 'Département', sortable: true },
    { key: 'profession', label: 'Profession', sortable: true },
    { key: 'adresse', label: 'Adresse', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  // Modals visibility
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Current personnel being edited or deleted
  currentPersonnel: any = null;

  // Form model for create/edit
  personnelForm = {
    id: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: '',
    departement: '',
    profession: '',
    adresse: '',
  };

  constructor(private service: PersonnelsService) {}

  personnels: Personnel[] = [];

  private refresh() {
    this.service.getAll().subscribe((data) => (this.personnels = data));
  }

  // Event handlers
  handleNew() {
    this.personnelForm = {
      id: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      specialite: '',
      departement: '',
      profession: '',
      adresse: '',
    };
    this.showCreateModal = true;
  }

  handleRefresh() { this.refresh(); }

  handleEdit(personnel: any) {
    this.currentPersonnel = personnel;
    this.personnelForm = { ...personnel };
    this.showEditModal = true;
  }

  handleDelete(personnel: any) {
    this.currentPersonnel = personnel;
    this.showDeleteModal = true;
  }

  handleRowClick(personnel: any) {
    console.log('Row clicked:', personnel);
  }

  // CRUD operations
  createPersonnel() {
    const { id, nom, prenom, email, telephone, specialite, departement, profession, adresse } = this.personnelForm;
    this.service
      .create({ id: id || undefined, nom: nom!, prenom: prenom!, email: email!, telephone: telephone!, specialite: specialite!, departement: departement!, profession: profession!, adresse: adresse! })
      .subscribe(() => {
        this.showCreateModal = false;
        this.refresh();
      });
  }

  updatePersonnel() {
    if (this.currentPersonnel) {
      const { nom, prenom, email, telephone, specialite, departement, profession, adresse } = this.personnelForm;
      this.service
        .update(this.currentPersonnel.id, { nom, prenom, email, telephone, specialite, departement, profession, adresse })
        .subscribe(() => {
          this.showEditModal = false;
          this.refresh();
        });
    } else {
      this.showEditModal = false;
    }
  }

  deletePersonnel() {
    if (this.currentPersonnel) {
      this.service.delete(this.currentPersonnel.id).subscribe(() => {
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
