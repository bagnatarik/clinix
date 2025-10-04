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

  // Modals visibility
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Current user being edited or deleted
  currentUser: any = null;

  // Form model for create/edit
  userForm = {
    name: '',
    email: '',
  };

  // Event handlers
  handleNew() {
    this.userForm = { name: '', email: '' };
    this.showCreateModal = true;
  }
  handleRefresh() {
    toast.info('this one will call api /get/lists to refetch the list in table');
  }

  handleEdit(user: any) {
    this.currentUser = user;
    this.userForm = { name: user.name, email: user.email };
    this.showEditModal = true;
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
    // const newId = Math.max(...this.users.map((u) => u.id)) + 1;
    // this.users.push({
    //   id: newId,
    //   name: this.userForm.name,
    //   email: this.userForm.email,
    // });
    this.showCreateModal = false;
  }

  updateUser() {
    if (this.currentUser) {
      const index = this.users.findIndex((u) => u.id === this.currentUser.id);
      if (index !== -1) {
        this.users[index] = {
          ...this.currentUser,
          name: this.userForm.name,
          email: this.userForm.email,
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
    },
  ];
}
