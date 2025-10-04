import { Component } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-role',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './user-role.html',
  styleUrl: './user-role.css',
})
export class UserRole {
  columns: Column[] = [
    { key: 'id', label: 'Identifiant', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'permissions', label: 'Permissions', sortable: false },
    { key: 'nbUsers', label: "Nombre d'utilisateurs affectés", sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  // Modals visibility
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Current role being edited or deleted
  currentRole: any = null;

  // Form model for create/edit
  roleForm = {
    libelle: '',
    permissions: [] as string[],
  };

  // Event handlers
  handleNew() {
    this.roleForm = { libelle: '', permissions: [] };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('this one will call api /roles to refetch the list in table');
  }

  handleEdit(role: any) {
    this.currentRole = role;
    this.roleForm = { libelle: role.libelle, permissions: [...role.permissions] };
    this.showEditModal = true;
  }

  handleDelete(role: any) {
    this.currentRole = role;
    this.showDeleteModal = true;
  }

  handleRowClick(role: any) {
    // Optionally handle row click, e.g. show details
    console.log('Row clicked:', role);
  }

  // CRUD operations
  createRole() {
    this.showCreateModal = false;
  }

  updateRole() {
    if (this.currentRole) {
      const index = this.roles.findIndex((r) => r.id === this.currentRole.id);
      if (index !== -1) {
        this.roles[index] = {
          ...this.currentRole,
          libelle: this.roleForm.libelle,
          permissions: this.roleForm.permissions,
        };
      }
    }
    this.showEditModal = false;
  }

  deleteRole() {
    if (this.currentRole) {
      this.roles = this.roles.filter((r) => r.id !== this.currentRole.id);
    }
    this.showDeleteModal = false;
  }

  roles = [
    {
      id: 'admin',
      libelle: 'Administrateur',
      permissions: [
        'Créer utilisateur',
        'Modifier utilisateur',
        'Supprimer utilisateur',
        'Gérer rôles',
      ],
      nbUsers: 3,
    },
    {
      id: 'doctor',
      libelle: 'Docteur',
      permissions: ['Consulter dossier patient', 'Éditer rapport médical', 'Prescrire traitement'],
      nbUsers: 5,
    },
    {
      id: 'nurse',
      libelle: 'Infirmière',
      permissions: [
        'Consulter dossier patient',
        'Administrer traitement',
        'Mettre à jour observations',
      ],
      nbUsers: 4,
    },
    {
      id: 'patient',
      libelle: 'Patient',
      permissions: ['Consulter mon dossier', 'Prendre rendez-vous', 'Contacter le médecin'],
      nbUsers: 15,
    },
    {
      id: 'laborant',
      libelle: 'Laborantin',
      permissions: [
        'Saisir résultats analyses',
        'Éditer rapport laboratoire',
        'Consulter dossier patient',
      ],
      nbUsers: 2,
    },
  ];
}
