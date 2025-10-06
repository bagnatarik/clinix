import { Component, OnInit } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-user-role',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './user-role.html',
  styleUrl: './user-role.css',
})
export class UserRole implements OnInit {
  columns: Column[] = [
    { key: 'id', label: 'Identifiant', sortable: true },
    { key: 'name', label: 'Libellé', sortable: true },
    // { key: 'actions', label: 'Actions', sortable: false },
  ];

  // Modals visibility
  showCreateModal = false;
  showDeleteModal = false;

  // Current role being edited or deleted
  currentRole: any = null;

  // Form model for create/edit
  roleForm = {
    id: '',
    nom: '',
  };

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  // Event handlers
  handleNew() {
    this.roleForm = { id: '', nom: '' };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.loadRoles();
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
    const { id, nom } = this.roleForm;
    if (!id || !nom) {
      toast.error('Identifiant et libellé sont requis');
      return;
    }
    const exists = this.roles.some((r) => r.id === id);
    if (exists) {
      toast.error('Un rôle avec cet identifiant existe déjà');
      return;
    }
    this.roles.push({ id, name: nom });
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

  roles: Array<{ id: string; name: string }> = [];

  private tonom(name: string): string {
    const id = (name || '').toLowerCase();
    console.log(id);

    switch (id) {
      case 'admin':
        return 'Administrateur';
      case 'doctor':
        return 'Docteur';
      case 'nurse':
        return 'Infirmière';
      case 'patient':
        return 'Patient';
      case 'laborant':
        return 'Laborantin';
      default:
        return name;
    }
  }

  private normalizeId(role: string): string {
    // Convert backend role formats like 'ROLE_ADMIN' or 'ADMIN' to lowercase id
    const cleaned = (role || '').replace(/^ROLE_/i, '').toLowerCase();
    return cleaned;
  }

  private loadRoles(): void {
    this.usersService.getRoles().subscribe({
      next: (list) => {
        this.roles = (list || [])
          .filter((r) => r.name.toLowerCase() !== 'user')
          .map((raw) => {
            const id = this.normalizeId(raw.name);
            return { id, name: this.tonom(id) };
          });
        toast.success('Rôles mis à jour');
      },
      error: () => {
        toast.error('Erreur lors du chargement des rôles');
      },
    });
  }
}
