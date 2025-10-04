import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-chambres',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './chambres.html',
  styleUrl: './chambres.css',
})
export class Chambres {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'numero', label: 'Numéro chambre', sortable: true },
    { key: 'etageLabel', label: 'Étages', sortable: true },
    { key: 'typeLabel', label: 'Type de chambre', sortable: true },
    { key: 'statut', label: 'Statut', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentRoom: any = null;

  roomForm = {
    id: '',
    numero: '',
    etageId: '',
    etageLabel: '',
    typeId: '',
    typeLabel: '',
    statut: 'libre',
  };

  handleNew() {
    this.roomForm = {
      id: '',
      numero: '',
      etageId: '',
      etageLabel: '',
      typeId: '',
      typeLabel: '',
      statut: 'libre',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    toast.info('Actualisation des chambres');
  }

  handleEdit(room: any) {
    this.currentRoom = room;
    this.roomForm = { ...room };
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
      numero: '101',
      etageId: 'E1',
      etageLabel: 'Étage 1',
      typeId: 'STD',
      typeLabel: 'Standard',
      statut: 'libre',
    },
    {
      id: 'CH102',
      numero: '102',
      etageId: 'E1',
      etageLabel: 'Étage 1',
      typeId: 'DEL',
      typeLabel: 'Deluxe',
      statut: 'occupée',
    },
    {
      id: 'CH201',
      numero: '201',
      etageId: 'E2',
      etageLabel: 'Étage 2',
      typeId: 'SUITE',
      typeLabel: 'Suite',
      statut: 'libre',
    },
  ];
}
