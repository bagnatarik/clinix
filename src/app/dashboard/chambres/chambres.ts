import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-chambres',
  imports: [DataTableComponent, FormsModule, CommonModule],
  templateUrl: './chambres.html',
  styleUrl: './chambres.css',
})
export class Chambres {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'etageLabel', label: 'Étages', sortable: true },
    { key: 'typeLabel', label: 'Type de chambre', sortable: true },
    { key: 'nbLits', label: 'Nombre de lits', sortable: true },
    { key: 'cout', label: 'Coût', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentRoom: any = null;

  roomForm = {
    id: '',
    nbLits: 0,
    cout: 0,
    etageId: '',
    etageLabel: '',
    typeId: '',
    typeLabel: '',
  };

  // Dropdown data sources
  etageOptions: { id: string; label: string }[] = [
    { id: 'E1', label: 'Étage 1' },
    { id: 'E2', label: 'Étage 2' },
    { id: 'E3', label: 'Étage 3' },
  ];

  typeOptions: { id: string; label: string }[] = [
    { id: 'STD', label: 'Standard' },
    { id: 'DEL', label: 'Deluxe' },
    { id: 'SUITE', label: 'Suite' },
  ];

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
    this.roomForm.etageId = option.id;
    this.roomForm.etageLabel = option.label;
    this.etageDropdownOpen = false;
  }

  selectType(option: { id: string; label: string }) {
    this.roomForm.typeId = option.id;
    this.roomForm.typeLabel = option.label;
    this.typeDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.etageDropdownOpen) {
      const inEtage = this.etageTrigger?.nativeElement.contains(target) || this.etageMenu?.nativeElement.contains(target);
      if (!inEtage) this.etageDropdownOpen = false;
    }
    if (this.typeDropdownOpen) {
      const inType = this.typeTrigger?.nativeElement.contains(target) || this.typeMenu?.nativeElement.contains(target);
      if (!inType) this.typeDropdownOpen = false;
    }
  }

  handleNew() {
    this.roomForm = {
      id: '',
      nbLits: 0,
      cout: 0,
      etageId: '',
      etageLabel: '',
      typeId: '',
      typeLabel: '',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('Actualisation des chambres');
  }

  handleEdit(room: any) {
    this.currentRoom = room;
    this.roomForm = {
      id: room.id ?? '',
      nbLits: room.nbLits ?? 0,
      cout: room.cout ?? 0,
      etageId: room.etageId ?? '',
      etageLabel: room.etageLabel ?? '',
      typeId: room.typeId ?? '',
      typeLabel: room.typeLabel ?? '',
    };
    this.showEditModal = true;
  }

  handleDelete(room: any) {
    this.currentRoom = room;
    this.showDeleteModal = true;
  }

  handleRowClick(room: any) {
    console.log('Row clicked:', room);
  }

  createRoom() {
    const newItem = { ...this.roomForm };
    if (!newItem.id) newItem.id = `CH${Math.floor(Math.random() * 1000)}`;
    this.chambres = [newItem, ...this.chambres];
    this.showCreateModal = false;
  }

  updateRoom() {
    if (this.currentRoom) {
      const index = this.chambres.findIndex((t) => t.id === this.currentRoom.id);
      if (index !== -1) this.chambres[index] = { ...this.currentRoom, ...this.roomForm };
    }
    this.showEditModal = false;
  }

  deleteRoom() {
    if (this.currentRoom) {
      this.chambres = this.chambres.filter((t) => t.id !== this.currentRoom.id);
    }
    this.showDeleteModal = false;
  }

  chambres = [
    {
      id: 'CH101',
      nbLits: 2,
      cout: 35000,
      etageId: 'E1',
      etageLabel: 'Étage 1',
      typeId: 'STD',
      typeLabel: 'Standard',
    },
    {
      id: 'CH102',
      nbLits: 1,
      cout: 28000,
      etageId: 'E1',
      etageLabel: 'Étage 1',
      typeId: 'DEL',
      typeLabel: 'Deluxe',
    },
    {
      id: 'CH201',
      nbLits: 3,
      cout: 50000,
      etageId: 'E2',
      etageLabel: 'Étage 2',
      typeId: 'SUITE',
      typeLabel: 'Suite',
    },
  ];
}
