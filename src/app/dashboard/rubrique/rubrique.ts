import { Component, OnInit } from '@angular/core';
import { toast } from 'ngx-sonner';
import { Column } from '../../core/interfaces/column';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { FormsModule } from '@angular/forms';
import { RubriquesService } from './rubrique.service';
import { Rubrique } from '../../core/interfaces/admin';

@Component({
  selector: 'app-rubriques',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './rubrique.html',
  styleUrl: './rubrique.css',
})
export class Rubriques implements OnInit {
  columns: Column[] = [
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentRubrique: any = null;

  rubriqueForm = { libelle: '' };

  constructor(private service: RubriquesService) {}

  ngOnInit() { this.refresh(); }

  rubriques: Rubrique[] = [];

  private refresh() {
    this.service.getAll().subscribe({
      next: (data) => (this.rubriques = data),
      error: () => toast.error('Erreur lors du chargement des rubriques'),
    });
  }

  handleNew() { this.rubriqueForm = { libelle: '' }; this.showCreateModal = true; }
  handleRefresh() { this.refresh(); }
  handleEdit(rubrique: any) { this.currentRubrique = rubrique; this.rubriqueForm = { libelle: rubrique.libelle }; this.showEditModal = true; }
  handleDelete(rubrique: any) { this.currentRubrique = rubrique; this.showDeleteModal = true; }
  handleRowClick(rubrique: any) { console.log('Row clicked:', rubrique); }

  createRubrique() {
    const { libelle } = this.rubriqueForm;
    this.service.create(libelle!).subscribe(() => {
      toast.success('Rubrique créée avec succès');
      this.showCreateModal = false;
      this.refresh();
    });
  }

  updateRubrique() {
    if (this.currentRubrique) {
      const { libelle } = this.rubriqueForm;
      this.service.update(this.currentRubrique.publicId, { libelle }).subscribe(() => {
        toast.success('Rubrique mise à jour avec succès');
        this.showEditModal = false;
        this.refresh();
      });
    } else {
      this.showEditModal = false;
    }
  }

  deleteRubrique() {
    if (this.currentRubrique) {
      this.service.delete(this.currentRubrique.publicId).subscribe(() => {
        toast.success('Rubrique supprimée avec succès');
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}