import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';
import { TypesAntecedantService } from './types-antecedant.service';
import { TypeAntecedant } from '../../core/interfaces/admin';

@Component({
  selector: 'app-types-antecedant',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './types-antecedant.html',
  styleUrl: './types-antecedant.css'
})
export class TypesAntecedant implements OnInit {
  columns: Column[] = [
    // { key: 'publicId', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentType: TypeAntecedant | null = null;

  typeForm = {
    libelle: '',
  };

  constructor(private service: TypesAntecedantService) {}

  ngOnInit(): void {
    this.refresh();
  }

  typesAntecedant: TypeAntecedant[] = [];

  handleNew() {
    this.typeForm = { libelle: '' };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(type: any) {
    this.currentType = type as TypeAntecedant;
    this.typeForm = { libelle: (type as TypeAntecedant).libelle };
    this.showEditModal = true;
  }

  handleDelete(type: any) {
    this.currentType = type;
    this.showDeleteModal = true;
  }

  handleRowClick(type: any) {
    console.log('Row clicked:', type);
  }

  private refresh() {
    this.service.getAll().subscribe({
      next: (data) => (this.typesAntecedant = data),
      error: () => toast.error('Erreur lors du chargement des types d’antécédent'),
    });
  }

  createType() {
    const { libelle } = this.typeForm;
    this.service.create(libelle!).subscribe(() => {
      toast.success('Type d’antécédent créé avec succès');
      this.showCreateModal = false;
      this.refresh();
    });
  }

  updateType() {
    if (this.currentType) {
      const { libelle } = this.typeForm;
      this.service.update(this.currentType.publicId, { libelle }).subscribe(() => {
        toast.success('Type d’antécédent mis à jour avec succès');
        this.showEditModal = false;
        this.refresh();
      });
    } else {
      this.showEditModal = false;
    }
  }

  deleteType() {
    if (this.currentType) {
      this.service.delete(this.currentType.publicId).subscribe(() => {
        toast.success('Type d’antécédent supprimé avec succès');
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
