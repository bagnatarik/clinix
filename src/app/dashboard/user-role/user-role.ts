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
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  // Modals visibility
  showCreateModal = false;
  showDeleteModal = false;

  // Current role being edited or deleted
  currentRole: any = null;

  // Form model for create/edit
  roleForm = {
    id: '',
    libelle: '',
  };

  // Event handlers
  handleNew() {
    this.roleForm = { id: '', libelle: '' };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('this one will call api /roles to refetch the list in table');
  }

  // L’édition des rôles est désactivée pour sensibilité

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
    const { id, libelle } = this.roleForm;
    if (!id || !libelle) {
      toast.error('Identifiant et libellé sont requis');
      return;
    }
    const exists = this.roles.some((r) => r.id === id);
    if (exists) {
      toast.error("Un rôle avec cet identifiant existe déjà");
      return;
    }
    this.roles.push({ id, libelle });
    toast.success('Rôle créé');
    this.showCreateModal = false;
  }

  // Pas d’update: l’édition est interdite

  deleteRole() {
    if (this.currentRole) {
      this.roles = this.roles.filter((r) => r.id !== this.currentRole.id);
    }
    this.showDeleteModal = false;
  }

  roles = [
    { id: 'admin', libelle: 'Administrateur' },
    { id: 'doctor', libelle: 'Docteur' },
    { id: 'nurse', libelle: 'Infirmière' },
    { id: 'patient', libelle: 'Patient' },
    { id: 'laborant', libelle: 'Laborantin' },
  ];
}
