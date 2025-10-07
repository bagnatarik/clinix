import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';
import { ChambresService } from './chambres.service';
import { TypesChambreService } from '../types-chambre/types-chambre.service';
import { EtagesService } from '../etages/etages.service';
import { Chambre, ChambreRequest } from '../../core/interfaces/admin';

@Component({
  selector: 'app-chambres',
  imports: [DataTableComponent, FormsModule, CommonModule],
  templateUrl: './chambres.html',
  styleUrl: './chambres.css',
})
export class Chambres implements OnInit {
  columns: Column[] = [
    // { key: 'publicId', label: 'ID', sortable: true },
    { key: 'nomChambre', label: 'Nom', sortable: true },
    { key: 'libelleEtage', label: 'Étage', sortable: true },
    { key: 'libelleTypeChambre', label: 'Type de chambre', sortable: true },
    { key: 'nombreLit', label: 'Nombre de lits', sortable: true },
    { key: 'cout', label: 'Coût', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentRoom: Chambre | null = null;

  roomForm: ChambreRequest = {
    nomChambre: '',
    nombreLit: 0,
    cout: 0,
    idTypeChambre: '',
    idEtage: '',
  };

  // Dropdown data sources
  etageOptions: { id: string; label: string }[] = [];
  typeOptions: { id: string; label: string }[] = [];

  // Dropdown states and search
  etageDropdownOpen = false;
  typeDropdownOpen = false;
  etageSearch = '';
  typeSearch = '';
  activeEtageIndex = -1;
  activeTypeIndex = -1;

  @ViewChild('etageTrigger') etageTrigger!: ElementRef<HTMLButtonElement>;
  @ViewChild('etageMenu') etageMenu!: ElementRef<HTMLDivElement>;
  @ViewChild('etageSearchInput') etageSearchInput!: ElementRef<HTMLInputElement>;

  @ViewChild('typeTrigger') typeTrigger!: ElementRef<HTMLButtonElement>;
  @ViewChild('typeMenu') typeMenu!: ElementRef<HTMLDivElement>;
  @ViewChild('typeSearchInput') typeSearchInput!: ElementRef<HTMLInputElement>;

  get filteredEtages() {
    const q = this.etageSearch.toLowerCase().trim();
    return this.etageOptions.filter((e) => e.label.toLowerCase().includes(q));
  }

  get filteredTypes() {
    const q = this.typeSearch.toLowerCase().trim();
    return this.typeOptions.filter((t) => t.label.toLowerCase().includes(q));
  }

  toggleEtageDropdown() {
    this.etageDropdownOpen = !this.etageDropdownOpen;
    if (this.etageDropdownOpen) {
      setTimeout(() => this.etageSearchInput?.nativeElement?.focus(), 0);
    }
  }

  toggleTypeDropdown() {
    this.typeDropdownOpen = !this.typeDropdownOpen;
    if (this.typeDropdownOpen) {
      setTimeout(() => this.typeSearchInput?.nativeElement?.focus(), 0);
    }
  }

  selectEtage(option: { id: string; label: string }) {
    this.roomForm.idEtage = option.id;
    this.etageDropdownOpen = false;
  }

  selectType(option: { id: string; label: string }) {
    this.roomForm.idTypeChambre = option.id;
    this.typeDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.etageDropdownOpen) {
      const inEtage =
        this.etageTrigger?.nativeElement.contains(target) ||
        this.etageMenu?.nativeElement.contains(target);
      if (!inEtage) this.etageDropdownOpen = false;
    }
    if (this.typeDropdownOpen) {
      const inType =
        this.typeTrigger?.nativeElement.contains(target) ||
        this.typeMenu?.nativeElement.contains(target);
      if (!inType) this.typeDropdownOpen = false;
    }
  }

  handleNew() {
    this.roomForm = {
      nomChambre: '',
      nombreLit: 0,
      cout: 0,
      idEtage: '',
      idTypeChambre: '',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(room: Chambre) {
    this.currentRoom = room;
    this.roomForm = {
      nomChambre: room.nomChambre ?? '',
      nombreLit: room.nombreLit ?? 0,
      cout: room.cout ?? 0,
      idEtage: '',
      idTypeChambre: '',
    };

    const etage = this.etageOptions.find((e) => e.label === room.libelleEtage);
    const type = this.typeOptions.find((t) => t.label === room.libelleTypeChambre);
    if (etage) this.roomForm.idEtage = etage.id;
    if (type) this.roomForm.idTypeChambre = type.id;

    this.showEditModal = true;
  }

  handleDelete(room: Chambre) {
    this.currentRoom = room;
    this.showDeleteModal = true;
  }

  handleRowClick(room: Chambre) {
    console.log('Row clicked:', room);
  }

  createRoom() {
    const payload: ChambreRequest = { ...this.roomForm };
    this.service.create(payload).subscribe({
      next: () => {
        toast.success('Chambre créée avec succès');
        this.showCreateModal = false;
        this.refresh();
        this.roomForm = { nomChambre: '', nombreLit: 0, cout: 0, idEtage: '', idTypeChambre: '' };
      },
      error: () => toast.error('Erreur lors de la création de la chambre'),
    });
  }

  updateRoom() {
    if (this.currentRoom) {
      const payload: ChambreRequest = { ...this.roomForm };
      this.service.update(this.currentRoom.publicId, payload).subscribe({
        next: () => {
          toast.success('Chambre mise à jour avec succès');
          this.showEditModal = false;
          this.refresh();
        },
        error: () => toast.error('Erreur lors de la mise à jour de la chambre'),
      });
    } else {
      this.showEditModal = false;
    }
  }

  deleteRoom() {
    if (this.currentRoom) {
      this.service.delete(this.currentRoom.publicId).subscribe({
        next: () => {
          toast.success('Chambre supprimée avec succès');
          this.showDeleteModal = false;
          this.refresh();
        },
        error: () => toast.error('Erreur lors de la suppression de la chambre'),
      });
    } else {
      this.showDeleteModal = false;
    }
  }

  chambres: Chambre[] = [];

  constructor(
    private service: ChambresService,
    private typesService: TypesChambreService,
    private etagesService: EtagesService
  ) {}

  ngOnInit(): void {
    this.refresh();
    this.loadOptions();
  }

  private refresh() {
    this.service.getAll().subscribe({
      next: (data) => (this.chambres = data),
      error: () => toast.error('Erreur lors du chargement des chambres'),
    });
  }

  private loadOptions() {
    this.etagesService.getAll().subscribe({
      next: (etages) =>
        (this.etageOptions = etages.map((e) => ({ id: e.publicId, label: e.libelle }))),
      error: () => (this.etageOptions = []),
    });
    this.typesService.getAll().subscribe({
      next: (types) =>
        (this.typeOptions = types.map((t) => ({ id: t.publicId, label: t.libelle }))),
      error: () => (this.typeOptions = []),
    });
  }

  getEtageLabel(id: string): string {
    return this.etageOptions.find((e) => e.id === id)?.label || '';
  }

  getTypeLabel(id: string): string {
    return this.typeOptions.find((t) => t.id === id)?.label || '';
  }
}
