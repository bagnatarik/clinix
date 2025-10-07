import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';
import { GardesService } from './gardes.service';
import { Garde } from '../../core/interfaces/admin';

@Component({
  selector: 'app-gardes',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './gardes.html',
  styleUrl: './gardes.css',
})
export class Gardes {
  columns: Column[] = [
    // { key: 'publicId', label: 'ID', sortable: true },
    { key: 'dateDebut', label: 'Date début', sortable: true },
    // { key: 'heureDebut', label: 'Heure début', sortable: true },
    { key: 'dateFin', label: 'Date fin', sortable: true },
    // { key: 'heureFin', label: 'Heure fin', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentGarde: Garde | null = null;

  gardeForm = {
    dateDebut: '',
    // heureDebut: '',
    dateFin: '',
    // heureFin: '',
  };

  gardes: Garde[] = [];

  constructor(private gardesService: GardesService) {}

  ngOnInit() {
    this.refresh();
  }

  handleNew() {
    this.gardeForm = {
      dateDebut: '',
      // heureDebut: '',
      dateFin: '',
      // heureFin: '',
    };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(garde: Garde) {
    this.currentGarde = garde;
    this.gardeForm = {
      dateDebut: garde.dateDebut ?? '',
      // heureDebut: garde.heureDebut ?? '',
      dateFin: garde.dateFin ?? '',
      // heureFin: garde.heureFin ?? '',
    };
    this.showEditModal = true;
  }

  handleDelete(garde: Garde) {
    this.currentGarde = garde;
    this.showDeleteModal = true;
  }

  handleRowClick(garde: Garde) {
    console.log('Row clicked:', garde);
  }

  createGarde() {
    this.gardesService
      .create({
        dateDebut: this.gardeForm.dateDebut,
        // heureDebut: this.gardeForm.heureDebut,
        dateFin: this.gardeForm.dateFin,
        // heureFin: this.gardeForm.heureFin,
      })
      .subscribe({
        next: () => {
          toast.success('Garde créée');
          this.showCreateModal = false;
          this.refresh();
        },
        error: () => toast.error('Échec de la création de la garde'),
      });
  }

  updateGarde() {
    if (!this.currentGarde) return;
    this.gardesService
      .update(this.currentGarde.publicId, {
        dateDebut: this.gardeForm.dateDebut,
        // heureDebut: this.gardeForm.heureDebut,
        dateFin: this.gardeForm.dateFin,
        // heureFin: this.gardeForm.heureFin,
      })
      .subscribe({
        next: () => {
          toast.success('Garde mise à jour');
          this.showEditModal = false;
          this.refresh();
        },
        error: () => toast.error('Échec de la mise à jour'),
      });
  }

  deleteGarde() {
    if (!this.currentGarde) return;
    this.gardesService.delete(this.currentGarde.publicId).subscribe({
      next: () => {
        toast.success('Garde supprimée');
        this.showDeleteModal = false;
        this.refresh();
      },
      error: () => toast.error('Échec de la suppression'),
    });
  }

  private refresh() {
    this.gardesService.getAll().subscribe({
      next: (items) => (this.gardes = items),
      error: () => toast.error('Échec du chargement des gardes'),
    });
  }
}
