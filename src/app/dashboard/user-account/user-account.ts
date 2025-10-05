import { Component } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';

@Component({
  selector: 'app-user-account',
  imports: [DataTableComponent, CommonModule, FormsModule],
  templateUrl: './user-account.html',
  styleUrl: './user-account.css',
})
export class UserAccount {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'prenom', label: 'Prénom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'telephone', label: 'Téléphone', sortable: true },
    { key: 'role', label: 'Rôle', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'dateCreation', label: 'Date de création', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true },
  ];

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
    toast.info('this one will call api /get/lists to refetch the list in table');
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
    const id = this.generateId(this.userForm.nom, this.userForm.prenom);
    const dateCreation = this.todayFr();
    this.users.push({
      id,
      nom: this.userForm.nom,
      prenom: this.userForm.prenom,
      email: this.userForm.email,
      telephone: this.userForm.telephone,
      adresse: this.userForm.adresse,
      sexe: this.userForm.sexe,
      role: this.roleLabel(this.userForm.role),
      statut: 'Actif',
      dateCreation,
    });
    toast.success('Utilisateur créé');
    this.showCreateModal = false;
  }

  updateUser() {
    if (this.currentUser) {
      const index = this.users.findIndex((u) => u.id === this.currentUser.id);
      if (index !== -1) {
        this.users[index] = {
          ...this.users[index],
          nom: this.userForm.nom,
          prenom: this.userForm.prenom,
          email: this.userForm.email,
          telephone: this.userForm.telephone,
          adresse: this.userForm.adresse,
          role: this.roleLabel(this.userForm.role),
        };
      }
    }
    this.showEditModal = false;
  }

  deleteUser() {
    if (this.currentUser) {
      this.users = this.users.filter((u) => u.id !== this.currentUser.id);
    }
    this.showDeleteModal = false;
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
    // Simulation de la mise à jour côté serveur
    toast.success(`Mot de passe mis à jour pour l’utilisateur ${this.currentUser?.id || ''}`);
    this.showResetPasswordModal = false;
  }

  generatePassword(): string {
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

  users = [
    {
      id: 'DOEJO00',
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@clinix.com',
      telephone: '+228 90001111',
      role: 'Admin',
      statut: 'Actif',
      dateCreation: '01-01-2023',
      sexe: 'Homme',
      adresse: '123 Rue de la Santé, Lomé',
    },
    {
      id: 'SMIAL01',
      nom: 'Smith',
      prenom: 'Alice',
      email: 'alice.smith@clinix.com',
      telephone: '+228 90001112',
      role: 'Docteur',
      statut: 'Actif',
      dateCreation: '02-01-2023',
      sexe: 'Femme',
      adresse: '456 Avenue des Fleurs, Sokodé',
    },
    {
      id: 'JOHBO02',
      nom: 'Johnson',
      prenom: 'Bob',
      email: 'bob.johnson@clinix.com',
      telephone: '+228 90001113',
      role: 'Infirmière',
      statut: 'Inactif',
      dateCreation: '03-01-2023',
      sexe: 'Homme',
      adresse: '789 Boulevard du Marché, Kara',
    },
    {
      id: 'BROCH03',
      nom: 'Brown',
      prenom: 'Charlie',
      email: 'charlie.brown@clinix.com',
      telephone: '+228 90001114',
      role: 'Patient',
      statut: 'Actif',
      dateCreation: '04-01-2023',
      sexe: 'Homme',
      adresse: '321 Rue de l’Église, Kpalimé',
    },
    {
      id: 'DAVDA04',
      nom: 'Davis',
      prenom: 'David',
      email: 'david.davis@clinix.com',
      telephone: '+228 90001115',
      role: 'Laborantin',
      statut: 'Actif',
      dateCreation: '05-01-2023',
      sexe: 'Homme',
      adresse: '654 Avenue de la Paix, Atakpamé',
    },
    {
      id: 'WILEV05',
      nom: 'Wilson',
      prenom: 'Eve',
      email: 'eve.wilson@clinix.com',
      telephone: '+228 90001116',
      role: 'Docteur',
      statut: 'Actif',
      dateCreation: '06-01-2023',
      sexe: 'Femme',
      adresse: '987 Rue du Stade, Tsévié',
    },
    {
      id: 'MILFR06',
      nom: 'Miller',
      prenom: 'Frank',
      email: 'frank.miller@clinix.com',
      telephone: '+228 90001117',
      role: 'Infirmière',
      statut: 'Inactif',
      dateCreation: '07-01-2023',
      sexe: 'Homme',
      adresse: '147 Boulevard de l’Indépendance, Aného',
    },
    {
      id: 'TAYGR07',
      nom: 'Taylor',
      prenom: 'Grace',
      email: 'grace.taylor@clinix.com',
      telephone: '+228 90001118',
      role: 'Patient',
      statut: 'Actif',
      dateCreation: '08-01-2023',
      sexe: 'Femme',
      adresse: '258 Rue des Ecoles, Dapaong',
    },
    {
      id: 'ANDHE08',
      nom: 'Anderson',
      prenom: 'Heidi',
      email: 'heidi.anderson@clinix.com',
      telephone: '+228 90001119',
      role: 'Admin',
      statut: 'Actif',
      dateCreation: '09-01-2023',
      sexe: 'Femme',
      adresse: '369 Avenue du Cinéma, Mango',
    },
    {
      id: 'THOIV09',
      nom: 'Thomas',
      prenom: 'Ivan',
      email: 'ivan.thomas@clinix.com',
      telephone: '+228 90001120',
      role: 'Laborantin',
      statut: 'Actif',
      dateCreation: '10-01-2023',
      sexe: 'Homme',
      adresse: '741 Rue du Marché, Bassar',
    },
    {
      id: 'JACJU10',
      nom: 'Jackson',
      prenom: 'Judy',
      email: 'judy.jackson@clinix.com',
      telephone: '+228 90001121',
      role: 'Docteur',
      statut: 'Inactif',
      dateCreation: '11-01-2023',
      sexe: 'Femme',
      adresse: '852 Boulevard des Arts, Amlamé',
    },
    {
      id: 'WHIKA11',
      nom: 'White',
      prenom: 'Karl',
      email: 'karl.white@clinix.com',
      telephone: '+228 90001122',
      role: 'Infirmière',
      statut: 'Actif',
      dateCreation: '12-01-2023',
      sexe: 'Homme',
      adresse: '963 Rue de la Gare, Notsé',
    },
    {
      id: 'HARLI12',
      nom: 'Harris',
      prenom: 'Liam',
      email: 'liam.harris@clinix.com',
      telephone: '+228 90001123',
      role: 'Patient',
      statut: 'Actif',
      dateCreation: '13-01-2023',
      sexe: 'Homme',
      adresse: '159 Avenue de la Liberté, Sotouboua',
    },
    {
      id: 'MARMIA13',
      nom: 'Martin',
      prenom: 'Mia',
      email: 'mia.martin@clinix.com',
      telephone: '+228 90001124',
      role: 'Admin',
      statut: 'Actif',
      dateCreation: '14-01-2023',
      sexe: 'Femme',
      adresse: '357 Rue du Pont, Tchamba',
    },
    {
      id: 'THONO14',
      nom: 'Thompson',
      prenom: 'Nora',
      email: 'nora.thompson@clinix.com',
      telephone: '+228 90001125',
      role: 'Laborantin',
      statut: 'Inactif',
      dateCreation: '15-01-2023',
      sexe: 'Femme',
      adresse: '486 Boulevard du Lac, Badou',
    },
    {
      id: 'GAROS15',
      nom: 'Garcia',
      prenom: 'Oscar',
      email: 'oscar.garcia@clinix.com',
      telephone: '+228 90001126',
      role: 'Docteur',
      statut: 'Actif',
      dateCreation: '16-01-2023',
      sexe: 'Homme',
      adresse: '572 Rue des Palmiers, Kandé',
    },
    {
      id: 'MARPH16',
      nom: 'Martinez',
      prenom: 'Phoebe',
      email: 'phoebe.martinez@clinix.com',
      telephone: '+228 90001127',
      role: 'Infirmière',
      statut: 'Actif',
      dateCreation: '17-01-2023',
      sexe: 'Femme',
      adresse: '618 Avenue du Soleil, Pagouda',
    },
    {
      id: 'ROBQU17',
      nom: 'Robinson',
      prenom: 'Quentin',
      email: 'quentin.robinson@clinix.com',
      telephone: '+228 90001128',
      role: 'Patient',
      statut: 'Actif',
      dateCreation: '18-01-2023',
      sexe: 'Homme',
      adresse: '834 Rue de la Montagne, Tabligbo',
    },
    {
      id: 'CLARA18',
      nom: 'Clark',
      prenom: 'Rachel',
      email: 'rachel.clark@clinix.com',
      telephone: '+228 90001129',
      role: 'Admin',
      statut: 'Inactif',
      dateCreation: '19-01-2023',
      sexe: 'Femme',
      adresse: '925 Boulevard de la Mer, Agbodrafo',
    },
    {
      id: 'LEWSA19',
      nom: 'Lewis',
      prenom: 'Sam',
      email: 'sam.lewis@clinix.com',
      telephone: '+228 90001130',
      role: 'Laborantin',
      statut: 'Actif',
      dateCreation: '20-01-2023',
      sexe: 'Homme',
      adresse: '113 Rue du Bois, Zio',
    },
    {
      id: 'LEETA20',
      nom: 'Lee',
      prenom: 'Tara',
      email: 'tara.lee@clinix.com',
      telephone: '+228 90001131',
      role: 'Docteur',
      statut: 'Actif',
      dateCreation: '21-01-2023',
      sexe: 'Femme',
      adresse: '246 Avenue des Roses, Vogan',
    },
    {
      id: 'WALUM21',
      nom: 'Walker',
      prenom: 'Uma',
      email: 'uma.walker@clinix.com',
      telephone: '+228 90001132',
      role: 'Infirmière',
      statut: 'Actif',
      dateCreation: '22-01-2023',
      sexe: 'Femme',
      adresse: '379 Rue du Temple, Kpagouda',
    },
    {
      id: 'HALVI22',
      nom: 'Hall',
      prenom: 'Victor',
      email: 'victor.hall@clinix.com',
      telephone: '+228 90001133',
      role: 'Patient',
      statut: 'Actif',
      dateCreation: '23-01-2023',
      sexe: 'Homme',
      adresse: '508 Boulevard des Sports, Tohoun',
    },
    {
      id: 'ALLWE23',
      nom: 'Allen',
      prenom: 'Wendy',
      email: 'wendy.allen@clinix.com',
      telephone: '+228 90001134',
      role: 'Admin',
      statut: 'Inactif',
      dateCreation: '24-01-2023',
      sexe: 'Femme',
      adresse: '642 Rue de l’Hôpital, Lokossa',
    },
    {
      id: 'YOUXA24',
      nom: 'Young',
      prenom: 'Xavier',
      email: 'xavier.young@clinix.com',
      telephone: '+228 90001135',
      role: 'Laborantin',
      statut: 'Actif',
      dateCreation: '25-01-2023',
      sexe: 'Homme',
      adresse: '775 Avenue des Acacias, Aneho',
    },
    {
      id: 'HERYA25',
      nom: 'Hernandez',
      prenom: 'Yara',
      email: 'yara.hernandez@clinix.com',
      telephone: '+228 90001136',
      role: 'Docteur',
      statut: 'Actif',
      dateCreation: '26-01-2023',
      sexe: 'Femme',
      adresse: '881 Rue du Coq, Grand-Popo',
    },
    {
      id: 'KINZA26',
      nom: 'King',
      prenom: 'Zane',
      email: 'zane.king@clinix.com',
      telephone: '+228 90001137',
      role: 'Infirmière',
      statut: 'Actif',
      dateCreation: '27-01-2023',
      sexe: 'Homme',
      adresse: '999 Boulevard des Lions, Ouidah',
    },
    {
      id: 'WRIAB27',
      nom: 'Wright',
      prenom: 'Abby',
      email: 'abby.wright@clinix.com',
      telephone: '+228 90001138',
      role: 'Patient',
      statut: 'Inactif',
      dateCreation: '28-01-2023',
      sexe: 'Femme',
      adresse: '112 Rue des Étoiles, Cotonou',
    },
    {
      id: 'LOPBR28',
      nom: 'Lopez',
      prenom: 'Bruce',
      email: 'bruce.lopez@clinix.com',
      telephone: '+228 90001139',
      role: 'Admin',
      statut: 'Actif',
      dateCreation: '29-01-2023',
      sexe: 'Homme',
      adresse: '334 Avenue du Rêve, Parakou',
    },
    {
      id: 'HILCA29',
      nom: 'Hill',
      prenom: 'Cara',
      email: 'cara.hill@clinix.com',
      telephone: '+228 90001140',
      role: 'Laborantin',
      statut: 'Actif',
      dateCreation: '30-01-2023',
      sexe: 'Femme',
      adresse: '557 Rue du Parc, Natitingou',
    },
    {
      id: 'GREDE30',
      nom: 'Green',
      prenom: 'Derek',
      email: 'derek.green@clinix.com',
      telephone: '+228 90001141',
      role: 'Docteur',
      statut: 'Actif',
      dateCreation: '31-01-2023',
      sexe: 'Homme',
      adresse: '778 Boulevard du Moulin, Djougou',
    },
    {
      id: 'ADAEL31',
      nom: 'Adams',
      prenom: 'Elle',
      email: 'elle.adams@clinix.com',
      telephone: '+228 90001142',
      role: 'Infirmière',
      statut: 'Inactif',
      dateCreation: '01-02-2023',
      sexe: 'Femme',
      adresse: '990 Rue du Souvenir, Bohicon',
    },
    {
      id: 'BAKFI32',
      nom: 'Baker',
      prenom: 'Finn',
      email: 'finn.baker@clinix.com',
      telephone: '+228 90001143',
      role: 'Patient',
      statut: 'Actif',
      dateCreation: '02-02-2023',
      sexe: 'Homme',
      adresse: '221 Avenue du Vent, Abomey',
    },
    {
      id: 'GONGI33',
      nom: 'Gonzalez',
      prenom: 'Gina',
      email: 'gina.gonzalez@clinix.com',
      telephone: '+228 90001144',
      role: 'Admin',
      statut: 'Actif',
      dateCreation: '03-02-2023',
      sexe: 'Femme',
      adresse: '443 Rue du Pont, Savalou',
    },
    {
      id: 'NELHA34',
      nom: 'Nelson',
      prenom: 'Hank',
      email: 'hank.nelson@clinix.com',
      telephone: '+228 90001145',
      role: 'Laborantin',
      statut: 'Actif',
      dateCreation: '04-02-2023',
      sexe: 'Homme',
      adresse: '666 Boulevard du Temps, Dogbo',
    },
    {
      id: 'CARIR35',
      nom: 'Carter',
      prenom: 'Iris',
      email: 'iris.carter@clinix.com',
      telephone: '+228 90001146',
      role: 'Docteur',
      statut: 'Inactif',
      dateCreation: '05-02-2023',
      sexe: 'Femme',
      adresse: '884 Rue de la Lune, Cové',
    },
    {
      id: 'MITJA36',
      nom: 'Mitchell',
      prenom: 'Jack',
      email: 'jack.mitchell@clinix.com',
      telephone: '+228 90001147',
      role: 'Infirmière',
      statut: 'Actif',
      dateCreation: '06-02-2023',
      sexe: 'Homme',
      adresse: '115 Avenue du Soleil, Glazoué',
    },
    {
      id: 'PERKA37',
      nom: 'Perez',
      prenom: 'Kara',
      email: 'kara.perez@clinix.com',
      telephone: '+228 90001148',
      role: 'Patient',
      statut: 'Actif',
      dateCreation: '07-02-2023',
      sexe: 'Femme',
      adresse: '339 Rue des Nuages, Bembéréké',
    },
    {
      id: 'ROBLE38',
      nom: 'Roberts',
      prenom: 'Leo',
      email: 'leo.roberts@clinix.com',
      telephone: '+228 90001149',
      role: 'Admin',
      statut: 'Actif',
      dateCreation: '08-02-2023',
      sexe: 'Homme',
      adresse: '558 Boulevard des Rêves, Tchaourou',
    },
    {
      id: 'TURMA39',
      nom: 'Turner',
      prenom: 'Maya',
      email: 'maya.turner@clinix.com',
      telephone: '+228 90001150',
      role: 'Laborantin',
      statut: 'Inactif',
      dateCreation: '09-02-2023',
      sexe: 'Femme',
      adresse: '772 Rue de l’Espoir, Kétou',
    },
  ];
}
