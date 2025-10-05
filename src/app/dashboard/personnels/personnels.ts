import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PersonnelsService } from './personnels.service';
import { Personnel, Departement, Profession, Specialite } from '../../core/interfaces/admin';
import { DepartementsService } from '../departements/departements.service';
import { ProfessionsService } from '../professions/professions.service';
import { SpecialitesService } from '../specialites/specialites.service';
import { AuthenticationService } from '../../authentication/services/authentication-service';

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
    { key: 'specialite', label: 'Spécialité', sortable: true },
    { key: 'departement', label: 'Département', sortable: true },
    { key: 'profession', label: 'Profession', sortable: true },
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
    utilisateur: '',
    specialite: '',
    departement: '',
    profession: '',
  };

  // Données pour affichage du tableau (avec champs calculés)
  displayRows: any[] = [];

  // Sources des listes
  departementsList: Departement[] = [];
  professionsList: Profession[] = [];
  specialitesList: Specialite[] = [];

  // Utilisateurs (exclure patients)
  usersCandidates: { name: string; role: string }[] = [];

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
    private auth: AuthenticationService
  ) {}

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

  ngOnInit(): void {
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
    this.auth.getAllUsers().subscribe((users) => {
      this.usersCandidates = users.map((u) => ({ name: u.name, role: u.role as string }));
    });
  }

  // Event handlers
  handleNew() {
    this.personnelForm = {
      utilisateur: '',
      specialite: '',
      departement: '',
      profession: '',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(personnel: any) {
    this.currentPersonnel = personnel;
    // Pré-remplir à partir du personnel existant
    this.personnelForm = {
      utilisateur: `${personnel?.prenom ?? ''} ${personnel?.nom ?? ''}`.trim(),
      specialite: personnel?.specialite ?? '',
      departement: personnel?.departement ?? '',
      profession: personnel?.profession ?? '',
    };
    this.showEditModal = true;
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
      const current = this.personnelForm.utilisateur || '';
      const idx = list.findIndex((u) => u.name === current);
      this.userActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.userSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectUser(name: string) {
    this.personnelForm.utilisateur = name;
    this.userDropdownOpen = false;
  }

  toggleSpecialiteDropdown() {
    this.specialiteDropdownOpen = !this.specialiteDropdownOpen;
    if (this.specialiteDropdownOpen) {
      const list = this.filteredSpecialites;
      const current = this.personnelForm.specialite || '';
      const idx = list.findIndex((s) => s.libelle === current);
      this.specialiteActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.specialiteSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectSpecialite(label: string) {
    this.personnelForm.specialite = label;
    this.specialiteDropdownOpen = false;
  }

  toggleDepartementDropdown() {
    this.departementDropdownOpen = !this.departementDropdownOpen;
    if (this.departementDropdownOpen) {
      const list = this.filteredDepartements;
      const current = this.personnelForm.departement || '';
      const idx = list.findIndex((d) => d.libelle === current);
      this.departementActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.departementSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectDepartement(label: string) {
    this.personnelForm.departement = label;
    this.departementDropdownOpen = false;
  }

  toggleProfessionDropdown() {
    this.professionDropdownOpen = !this.professionDropdownOpen;
    if (this.professionDropdownOpen) {
      const list = this.filteredProfessions;
      const current = this.personnelForm.profession || '';
      const idx = list.findIndex((p) => p.libelle === current);
      this.professionActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.professionSearchRef?.nativeElement.focus(), 0);
    }
  }
  selectProfession(label: string) {
    this.personnelForm.profession = label;
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
    const { utilisateur, specialite, departement, profession } = this.personnelForm;
    const parts = (utilisateur || '').trim().split(' ');
    const prenom = parts[0] || '';
    const nom = parts.slice(1).join(' ') || '';
    this.service
      .create({
        nom,
        prenom,
        email: '',
        telephone: '',
        specialite: specialite!,
        departement: departement!,
        profession: profession!,
        adresse: '',
      })
      .subscribe(() => {
        this.showCreateModal = false;
        this.refresh();
      });
  }

  updatePersonnel() {
    if (this.currentPersonnel) {
      const { utilisateur, specialite, departement, profession } = this.personnelForm;
      const parts = (utilisateur || '').trim().split(' ');
      const prenom = parts[0] || '';
      const nom = parts.slice(1).join(' ') || '';
      this.service
        .update(this.currentPersonnel.id, { nom, prenom, specialite, departement, profession })
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

  // Filtres pour les listes de sélection
  get filteredUsersCandidates() {
    const q = this.userSearch.toLowerCase();
    return this.usersCandidates.filter(
      (u) => u.role !== 'patient' && u.name.toLowerCase().includes(q)
    );
  }
  get filteredSpecialites() {
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
