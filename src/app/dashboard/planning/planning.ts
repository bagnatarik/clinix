import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';
import { PlanningService } from './planning.service';
import { GardesService } from '../gardes/gardes.service';
import { PersonnelsService } from '../personnels/personnels.service';
import { PlanningRequest, PlanningResponse, Garde, Personnel } from '../../core/interfaces/admin';

@Component({
  selector: 'app-planning',
  imports: [DataTableComponent, FormsModule, CommonModule],
  templateUrl: './planning.html',
  styleUrl: './planning.css',
})
export class Planning implements OnInit {
  columns: Column[] = [
    // { key: 'publicId', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'nomPersonnel', label: 'Personnel', sortable: true },
    { key: 'dateDebutGarde', label: 'Début garde', sortable: true },
    { key: 'dateFinGarde', label: 'Fin garde', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  planning: PlanningResponse[] = [];
  currentItem: PlanningResponse | null = null;

  planningForm: PlanningRequest = {
    libelle: '',
    idGarde: '',
    idPersonnel: '',
  };

  // Dropdown states and search
  gardeDropdownOpen = false;
  personnelDropdownOpen = false;
  gardeSearch = '';
  personnelSearch = '';
  gardeActiveIndex = -1;
  personnelActiveIndex = -1;

  // Options dynamiques
  gardesOptions: { id: string; label: string; dateDebut: string; dateFin: string }[] = [];
  personnelsOptions: { id: string; label: string }[] = [];

  constructor(
    private planningService: PlanningService,
    private gardesService: GardesService,
    private personnelsService: PersonnelsService
  ) {}

  get filteredGardes() {
    const q = (this.gardeSearch || '').toLowerCase();
    return this.gardesOptions.filter((g) => g.label.toLowerCase().includes(q));
  }

  get filteredPersonnels() {
    const q = (this.personnelSearch || '').toLowerCase();
    return this.personnelsOptions.filter((p) => p.label.toLowerCase().includes(q));
  }

  handleNew() {
    this.planningForm = { libelle: '', idGarde: '', idPersonnel: '' };
    this.gardeSearch = '';
    this.personnelSearch = '';
    this.gardeDropdownOpen = false;
    this.personnelDropdownOpen = false;
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(item: PlanningResponse) {
    this.currentItem = item;
    this.planningForm.libelle = item.libelle || '';

    const p = this.personnelsOptions.find((x) => x.label === item.nomPersonnel);
    this.planningForm.idPersonnel = p?.id || '';
    const gardeLabel = this.buildGardeLabel(item.dateDebutGarde, item.dateFinGarde);
    const g = this.gardesOptions.find((x) => x.label === gardeLabel);
    this.planningForm.idGarde = g?.id || '';
    this.gardeSearch = '';
    this.personnelSearch = '';
    this.gardeDropdownOpen = false;
    this.personnelDropdownOpen = false;
    this.showEditModal = true;
  }

  handleDelete(item: PlanningResponse) {
    this.currentItem = item;
    this.showDeleteModal = true;
  }

  handleRowClick(item: PlanningResponse) {
    console.log('Row clicked:', item);
  }

  createPlanningItem() {
    this.planningService.create(this.planningForm).subscribe({
      next: () => {
        toast.success('Planning créé');
        this.showCreateModal = false;
        this.refresh();
      },
      error: () => toast.error('Échec de la création du planning'),
    });
  }

  updatePlanningItem() {
    if (!this.currentItem) return;
    this.planningService.update(this.currentItem.publicId, this.planningForm).subscribe({
      next: () => {
        toast.success('Planning mis à jour');
        this.showEditModal = false;
        this.refresh();
      },
      error: () => toast.error('Échec de la mise à jour'),
    });
  }

  // Dropdown helpers
  toggleGardeDropdown() {
    this.gardeDropdownOpen = !this.gardeDropdownOpen;
    this.gardeActiveIndex = -1;
  }

  togglePersonnelDropdown() {
    this.personnelDropdownOpen = !this.personnelDropdownOpen;
    this.personnelActiveIndex = -1;
  }

  selectGarde(g: { id: string; label: string }) {
    this.planningForm.idGarde = g.id;
    this.gardeDropdownOpen = false;
  }

  selectPersonnel(p: { id: string; label: string }) {
    this.planningForm.idPersonnel = p.id;
    this.personnelDropdownOpen = false;
  }

  deletePlanningItem() {
    if (!this.currentItem) return;
    this.planningService.delete(this.currentItem.publicId).subscribe({
      next: () => {
        toast.success('Planning supprimé');
        this.showDeleteModal = false;
        this.refresh();
      },
      error: () => toast.error('Échec de la suppression'),
    });
  }

  ngOnInit() {
    this.refresh();
    this.loadOptions();
  }

  private refresh() {
    this.planningService.getAll().subscribe({
      next: (rows) => (this.planning = rows || []),
      error: () => toast.error('Échec du chargement du planning'),
    });
  }

  private loadOptions() {
    this.gardesService.getAll().subscribe({
      next: (list: Garde[]) => {
        this.gardesOptions = list.map((g) => ({
          id: g.publicId,
          dateDebut: g.dateDebut,
          dateFin: g.dateFin,
          label: this.buildGardeLabel(g.dateDebut, g.dateFin),
        }));
      },
      error: () => (this.gardesOptions = []),
    });
    this.personnelsService.getAll().subscribe({
      next: (list: Personnel[]) => {
        this.personnelsOptions = list.map((p) => ({
          id: p.publicId,
          email: p.email,
          label: `${(p as any).prenom ?? ''} ${p.nom ?? ''}`.trim(),
        }));
      },
      error: () => (this.personnelsOptions = []),
    });
  }

  buildGardeLabel(dateDebut: string, dateFin: string): string {
    const formatDate = (iso: string) => {
      const d = new Date(iso);
      const day = d.getDate().toString().padStart(2, '0');
      const month = d.toLocaleDateString('fr-FR', { month: 'long' });
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    };
    const d1 = dateDebut ? formatDate(dateDebut) : '';
    const d2 = dateFin ? formatDate(dateFin) : '';
    return d1 && d2 ? `${d1} à ${d2}` : d1 || d2 || '';
  }

  getGardeLabel(id: string): string {
    return this.gardesOptions.find((g) => g.id === id)?.label || '';
  }
  getPersonnelLabel(id: string): string {
    return this.personnelsOptions.find((p) => p.id === id)?.label || '';
  }
}
