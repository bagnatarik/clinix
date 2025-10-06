import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';
import {
  UsersService,
  CreateUserPayload,
  UpdateUserPayload,
  UserAccountItem,
} from '../../core/services/users.service';

@Component({
  selector: 'app-user-account',
  imports: [DataTableComponent, CommonModule, FormsModule],
  templateUrl: './user-account.html',
  styleUrl: './user-account.css',
})
export class UserAccount implements OnInit {
  constructor(private usersService: UsersService) {}

  users: UserAccountItem[] = [];
  columns: Column[] = [
    // { key: 'id', label: 'ID', sortable: true },
    // { key: 'nom', label: 'Nom', sortable: true },
    // { key: 'prenom', label: 'Prénom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    // { key: 'telephone', label: 'Téléphone', sortable: true },
    { key: 'role', label: 'Rôle', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'dateCreation', label: 'Date de création', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true },
  ];

  ngOnInit(): void {
    this.handleRefresh();
  }

  // Table des rôles (id, libellé)
  roles: Array<{ id: string; libelle: string }> = [
    { id: 'admin', libelle: 'Admin' },
    { id: 'doctor', libelle: 'Docteur' },
    { id: 'nurse', libelle: 'Infirmière' },
    { id: 'laborant', libelle: 'Laborantin' },
    { id: 'patient', libelle: 'Patient' },
  ];

  // Modals visibility
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showViewModal = false;
  showResetPasswordModal = false;

  // Current user being edited or deleted
  currentUser: any = null;

  // Form model for create/edit
  userForm = {
    email: '',
    password: '',
    sexe: '',
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    role: '',
  };

  // Formulaire pour changement de mot de passe
  passwordForm = {
    newPassword: '',
    confirmPassword: '',
  };

  // Event handlers
  handleNew() {
    this.userForm = {
      email: '',
      password: this.generatePassword(),
      sexe: '',
      nom: '',
      prenom: '',
      telephone: '',
      adresse: '',
      role: '',
    };
    this.showCreateModal = true;
  }
  handleRefresh() {
    this.usersService.getAll().subscribe((list) => {
      this.users =
        list.map((user) => ({
          ...user,
          email: user.username || '',
          role: this.roleLabel(user.roles.toLowerCase() || 'User'),
          statut: user.enable ? 'Actif' : 'Inactif',
          dateCreation: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '',
        })) || [];
      toast.success('Liste des utilisateurs mise à jour');
    });
  }

  handleEdit(user: any) {
    this.currentUser = user;
    this.userForm = {
      email: user.email || '',
      password: '',
      sexe: user.sexe || '',
      nom: user.nom || '',
      prenom: user.prenom || '',
      telephone: user.telephone || '',
      adresse: user.adresse || '',
      role: this.roleIdFromLabel(user.role || ''),
    };
    this.showEditModal = true;
  }

  handleViewProfile(user: any) {
    this.currentUser = user;
    this.showViewModal = true;
  }

  handleResetPassword(user: any) {
    this.currentUser = user;
    this.passwordForm = { newPassword: '', confirmPassword: '' };
    this.showResetPasswordModal = true;
  }

  handleDelete(user: any) {
    this.currentUser = user;
    this.showDeleteModal = true;
  }

  handleRowClick(user: any) {
    // Optionally handle row click, e.g. show details
    console.log('Row clicked:', user);
  }

  // CRUD operations
  createUser() {
    const payload: CreateUserPayload = {
      email: this.userForm.email,
      password: this.userForm.password,
      sexe: this.userForm.sexe,
      nom: this.userForm.nom,
      prenom: this.userForm.prenom,
      telephone: this.userForm.telephone,
      adresse: this.userForm.adresse,
      role: this.roleLabel(this.userForm.role),
    };
    this.usersService.create(payload).subscribe((created) => {
      this.users = [created, ...this.users];
      toast.success('Utilisateur créé');
      this.showCreateModal = false;
    });
  }

  updateUser() {
    if (this.currentUser) {
      const changes: UpdateUserPayload = {
        email: this.userForm.email,
        sexe: this.userForm.sexe,
        nom: this.userForm.nom,
        prenom: this.userForm.prenom,
        telephone: this.userForm.telephone,
        adresse: this.userForm.adresse,
        role: this.roleLabel(this.userForm.role),
      };
      this.usersService.update(this.currentUser.id, changes).subscribe((updated) => {
        const index = this.users.findIndex((u) => u.id === this.currentUser.id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...updated };
        }
        this.showEditModal = false;
        toast.success('Utilisateur mis à jour');
      });
    } else {
      this.showEditModal = false;
    }
  }

  deleteUser() {
    if (this.currentUser) {
      this.usersService.delete(this.currentUser.id).subscribe(() => {
        this.users = this.users.filter((u) => u.id !== this.currentUser.id);
        toast.success('Utilisateur supprimé');
        this.showDeleteModal = false;
      });
    } else {
      this.showDeleteModal = false;
    }
  }

  closeView() {
    this.showViewModal = false;
  }

  resetPassword() {
    const { newPassword, confirmPassword } = this.passwordForm;
    if (!newPassword || newPassword.length < 8) {
      toast.error('Le mot de passe doit comporter au moins 8 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (!this.currentUser) {
      toast.error('Aucun utilisateur sélectionné');
      return;
    }
    this.usersService.resetPassword(this.currentUser.id, newPassword).subscribe({
      next: () => {
        toast.success(`Mot de passe mis à jour pour l’utilisateur ${this.currentUser.id}`);
        this.showResetPasswordModal = false;
      },
      error: () => {
        toast.error('Erreur lors de la mise à jour du mot de passe');
      },
    });
  }

  generatePassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@$!%*?&';
    let pass = '';
    for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    return pass;
  }
  regeneratePassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@$!%*?&';
    let pass = '';
    for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
    toast.info('Mot de passe généré avec succès');
    return pass;
  }

  roleLabel(roleId: string): string {
    const found = this.roles.find((r) => r.id === roleId);
    return found?.libelle || roleId || '';
  }

  roleIdFromLabel(label: string): string {
    const found = this.roles.find((r) => r.libelle === label);
    return found?.id || '';
  }

  generateId(nom: string, prenom: string): string {
    const n = (nom || '').toUpperCase().padEnd(3, 'X').slice(0, 3);
    const p = (prenom || '').toUpperCase().padEnd(2, 'X').slice(0, 2);
    const num = String(Math.floor(Math.random() * 100)).padStart(2, '0');
    return `${n}${p}${num}`;
  }

  todayFr(): string {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
