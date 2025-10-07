import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PersonnelsService } from './personnels.service';
import {
  Personnel,
  Departement,
  Profession,
  Specialite,
  PersonnelRequest,
} from '../../core/interfaces/admin';
import { DepartementsService } from '../departements/departements.service';
import { ProfessionsService } from '../professions/professions.service';
import { SpecialitesService } from '../specialites/specialites.service';
import { Role } from '../../core/interfaces/role-type';
import { UsersService } from '../../core/services/users.service';
import {
  AuthenticationService,
  UserInfo,
} from '../../authentication/services/authentication-service';

@Component({
  selector: 'app-personnels',
  imports: [DataTableComponent, FormsModule, CommonModule],
  templateUrl: './personnels.html',
  styleUrl: './personnels.css',
})
export class Personnels implements OnInit {
  // Colonnes: uniquement les attributs demandés
  columns: Column[] = [
    { key: 'utilisateur', label: 'Utilisateur', sortable: true },
    { key: 'dateNaissance', label: 'Date de naissance', sortable: true },
    { key: 'sexe', label: 'Sexe', sortable: true },
    { key: 'libelleSpecialite', label: 'Spécialité', sortable: true },
    { key: 'libelleDepartement', label: 'Département', sortable: true },
    { key: 'libelleProfession', label: 'Profession', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  // Modals visibility
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  // Current personnel being edited or deleted
  currentPersonnel: any = null;

  // Formulaire limité aux attributs requis
  personnelForm = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    telephone: '',
    email: '',
    adresse: '',
    idProfession: '',
    idSpecialite: '',
    idDepartement: '',
    idUser: '',
  };

  // Données pour affichage du tableau (avec champs calculés)
  displayRows: any[] = [];

  // Sources des listes
  departementsList: Departement[] = [];
  professionsList: Profession[] = [];
  specialitesList: Specialite[] = [];

  // Utilisateurs (exclure patients)
  usersCandidates: {
    id: string;
    publicId: string;
    email: string;
    name: string;
    role: Role;
    personnel?: Personnel;
  }[] = [];

  // Recherche pour selects
  userSearch = '';
  specialiteSearch = '';
  departementSearch = '';
  professionSearch = '';

  // Dropdown states & indices
  userDropdownOpen = false;
  specialiteDropdownOpen = false;
  departementDropdownOpen = false;
  professionDropdownOpen = false;

  // Selected values
  selectedUser = '';
  selectedSpecialite = '';
  selectedDepartement = '';
  selectedProfession = '';

  userActiveIndex = -1;
  specialiteActiveIndex = -1;
  departementActiveIndex = -1;
  professionActiveIndex = -1;

  // Refs pour focus et fermeture externe
  @ViewChild('userTrigger') userTrigger?: ElementRef;
  @ViewChild('userMenu') userMenu?: ElementRef;
  @ViewChild('userSearchInput') userSearchRef?: ElementRef<HTMLInputElement>;

  @ViewChild('specialiteTrigger') specialiteTrigger?: ElementRef;
  @ViewChild('specialiteMenu') specialiteMenu?: ElementRef;
  @ViewChild('specialiteSearchInput') specialiteSearchRef?: ElementRef<HTMLInputElement>;

  @ViewChild('departementTrigger') departementTrigger?: ElementRef;
  @ViewChild('departementMenu') departementMenu?: ElementRef;
  @ViewChild('departementSearchInput') departementSearchRef?: ElementRef<HTMLInputElement>;

  @ViewChild('professionTrigger') professionTrigger?: ElementRef;
  @ViewChild('professionMenu') professionMenu?: ElementRef;
  @ViewChild('professionSearchInput') professionSearchRef?: ElementRef<HTMLInputElement>;

  constructor(
    private service: PersonnelsService,
    private departementsService: DepartementsService,
    private professionsService: ProfessionsService,
    private specialitesService: SpecialitesService,
    private userService: UsersService,
    private authenticationService: AuthenticationService
  ) {}

  roles: Array<{ id: string; libelle: string }> = [
    { id: 'admin', libelle: 'Admin' },
    { id: 'doctor', libelle: 'Docteur' },
    { id: 'nurse', libelle: 'Infirmière' },
    { id: 'laborant', libelle: 'Laborantin' },
    { id: 'patient', libelle: 'Patient' },
  ];

  personnels: Personnel[] = [];

  private refresh() {
    this.service.getAll().subscribe((data) => {
      this.personnels = data;
      // Construire les lignes d’affichage avec champ utilisateur et planning
      this.displayRows = data.map((p) => ({
        ...p,
        utilisateur: `${p.prenom} ${p.nom}`.trim(),
      }));
    });
  }
  currentUser: UserInfo | null = null;

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCurrentUser();
    this.refresh();
    this.departementsService
      .getAll()
      .subscribe((list: Departement[]) => (this.departementsList = list));
    this.professionsService
      .getAll()
      .subscribe((list: Profession[]) => (this.professionsList = list));
    this.specialitesService
      .getAll()
      .subscribe((list: Specialite[]) => (this.specialitesList = list));
    this.userService.getAll().subscribe((users) => {
      this.usersCandidates = users.map((u) => {
        return {
          id: u.id,
          publicId: u.publicId,
          email: u.username,
          name: u.fullName,
          role: u.roles.toLowerCase() as Role,
          personnel: u.personnel,
        };
      });
    });
  }

  // Event handlers
  handleNew() {
    this.personnelForm = {
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: '',
      telephone: '',
      email: '',
      adresse: '',
      idProfession: '',
      idSpecialite: '',
      idDepartement: '',
      idUser: '',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(personnel: any) {
    this.currentPersonnel = personnel;
    this.personnelForm = {
      nom: personnel?.nom ?? '',
      prenom: personnel?.prenom ?? '',
      dateNaissance: personnel?.dateNaissance ?? '',
      sexe: personnel?.sexe ?? '',
      telephone: personnel?.telephone ?? '',
      email: personnel?.email ?? '',
      adresse: personnel?.adresse ?? '',
      idProfession: personnel?.idProfession ?? '',
      idSpecialite: personnel?.idSpecialite ?? '',
      idDepartement: personnel?.idDepartement ?? '',
      idUser:
        this.filteredUsersCandidates.find((u) => u.email === personnel?.email)?.publicId || '',
    };

    this.selectedDepartement = this.currentPersonnel.libelleDepartement || '';
    this.selectedProfession = this.currentPersonnel.libelleProfession || '';
    this.selectedSpecialite = this.currentPersonnel.libelleSpecialite || '';
    this.selectedUser = this.currentPersonnel.email || '';

    this.showEditModal = true;
  }

  roleLabel(roleId: string): string {
    const found = this.roles.find((r) => r.id === roleId);
    return found?.libelle || roleId || '';
  }

  handleDelete(personnel: any) {
    this.currentPersonnel = personnel;
    this.showDeleteModal = true;
  }

  handleRowClick(personnel: any) {
    console.log('Row clicked:', personnel);
  }

  // Toggle & select methods inspirées de Consultations/New
  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
    if (this.userDropdownOpen) {
      const list = this.filteredUsersCandidates;
      const current = this.personnelForm.email || '';
      const idx = list.findIndex((u) => u.name === current);
      this.userActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.userSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectUser(email: string, id: string, index: number) {
    this.selectedUser = email;
    this.personnelForm.email = email;
    this.personnelForm.idUser = id;
    this.userActiveIndex = index;
    this.userDropdownOpen = false;
  }

  toggleSpecialiteDropdown() {
    this.specialiteDropdownOpen = !this.specialiteDropdownOpen;
    if (this.specialiteDropdownOpen) {
      const list = this.filteredSpecialites;
      const current = this.personnelForm.idSpecialite || '';
      const idx = list.findIndex((s) => s.libelle === current);
      this.specialiteActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.specialiteSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectSpecialite(label: string, id: string, index: number) {
    this.personnelForm.idSpecialite = id;
    this.selectedSpecialite = label;
    this.specialiteActiveIndex = index;
    this.specialiteDropdownOpen = false;
  }

  toggleDepartementDropdown() {
    this.departementDropdownOpen = !this.departementDropdownOpen;
    if (this.departementDropdownOpen) {
      const list = this.filteredDepartements;
      const current = this.personnelForm.idDepartement || '';
      const idx = list.findIndex((d) => d.libelle === current);
      this.departementActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.departementSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectDepartement(label: string, id: string, index: number) {
    this.personnelForm.idDepartement = id;
    this.selectedDepartement = label;
    this.departementActiveIndex = index;
    this.departementDropdownOpen = false;
  }

  toggleProfessionDropdown() {
    this.professionDropdownOpen = !this.professionDropdownOpen;
    if (this.professionDropdownOpen) {
      const list = this.filteredProfessions;
      const current = this.personnelForm.idProfession || '';
      const idx = list.findIndex((p) => p.libelle === current);
      this.professionActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.professionSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectProfession(label: string, id: string, index: number) {
    this.personnelForm.idProfession = id;
    this.selectedProfession = label;
    this.professionActiveIndex = index;
    this.professionDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Node;
    // User
    if (this.userDropdownOpen) {
      if (this.userTrigger?.nativeElement.contains(target)) return;
      if (this.userMenu?.nativeElement.contains(target)) return;
      this.userDropdownOpen = false;
    }
    // Specialite
    if (this.specialiteDropdownOpen) {
      if (this.specialiteTrigger?.nativeElement.contains(target)) return;
      if (this.specialiteMenu?.nativeElement.contains(target)) return;
      this.specialiteDropdownOpen = false;
    }
    // Departement
    if (this.departementDropdownOpen) {
      if (this.departementTrigger?.nativeElement.contains(target)) return;
      if (this.departementMenu?.nativeElement.contains(target)) return;
      this.departementDropdownOpen = false;
    }
    // Profession
    if (this.professionDropdownOpen) {
      if (this.professionTrigger?.nativeElement.contains(target)) return;
      if (this.professionMenu?.nativeElement.contains(target)) return;
      this.professionDropdownOpen = false;
    }
  }

  // CRUD operations
  createPersonnel() {
    const {
      nom,
      prenom,
      dateNaissance,
      sexe,
      telephone,
      email,
      adresse,
      idProfession,
      idSpecialite,
      idDepartement,
      idUser,
    } = this.personnelForm;

    this.service
      .create({
        nom,
        prenom,
        email,
        telephone,
        idSpecialite,
        idDepartement,
        idProfession,
        adresse,
        dateNaissance,
        sexe,
        idCompte: idUser,
      } as PersonnelRequest)
      .subscribe(() => {
        toast.success('Personnel créé avec succès');
        this.showCreateModal = false;
        this.refresh();

        this.personnelForm = {
          nom: '',
          prenom: '',
          dateNaissance: '',
          sexe: '',
          telephone: '',
          email: '',
          adresse: '',
          idProfession: '',
          idSpecialite: '',
          idDepartement: '',
          idUser: '',
        };
        this.selectedUser = '';
        this.selectedSpecialite = '';
        this.selectedDepartement = '';
        this.selectedProfession = '';
      });
  }

  updatePersonnel() {
    if (this.currentPersonnel) {
      const {
        nom,
        prenom,
        dateNaissance,
        sexe,
        telephone,
        email,
        adresse,
        idProfession,
        idSpecialite,
        idDepartement,
        idUser,
      } = this.personnelForm;

      this.service
        .update(this.currentPersonnel.publicId, {
          nom,
          prenom,
          email,
          telephone,
          idSpecialite,
          idDepartement,
          idProfession,
          adresse,
          dateNaissance,
          sexe,
          idCompte: idUser,
        } as PersonnelRequest)
        .subscribe(() => {
          toast.success('Personnel modifié avec succès');
          this.showEditModal = false;
          this.refresh();

          this.personnelForm = {
            nom: '',
            prenom: '',
            dateNaissance: '',
            sexe: '',
            telephone: '',
            email: '',
            adresse: '',
            idProfession: '',
            idSpecialite: '',
            idDepartement: '',
            idUser: '',
          };
          this.selectedUser = '';
          this.selectedSpecialite = '';
          this.selectedDepartement = '';
          this.selectedProfession = '';
          this.currentPersonnel = null;
        });
    } else {
      this.showEditModal = false;
    }
  }

  deletePersonnel() {
    if (this.currentPersonnel) {
      this.service.delete(this.currentPersonnel.publicId).subscribe(() => {
        toast.success('Personnel supprimé avec succès');
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }

  // Filtres pour les listes de sélection
  get filteredUsersCandidates() {
    const q = this.userSearch.toLowerCase();

    return this.usersCandidates.filter(
      (u) =>
        u.role !== 'patient' &&
        u.email !== this.currentUser?.email &&
        u.personnel === undefined &&
        u.email.toLowerCase().includes(q)
    );
  }
  get filteredSpecialites(): Specialite[] {
    const q = this.specialiteSearch.toLowerCase();
    return this.specialitesList.filter((s) => s.libelle.toLowerCase().includes(q));
  }
  get filteredDepartements() {
    const q = this.departementSearch.toLowerCase();
    return this.departementsList.filter((d) => d.libelle.toLowerCase().includes(q));
  }
  get filteredProfessions() {
    const q = this.professionSearch.toLowerCase();
    return this.professionsList.filter((p) => p.libelle.toLowerCase().includes(q));
  }
}
