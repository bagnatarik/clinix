import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';
import { TypesChambreService } from './types-chambre.service';
import { TypeChambre } from '../../core/interfaces/admin';

@Component({
  selector: 'app-types-chambre',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './types-chambre.html',
  styleUrl: './types-chambre.css'
})
export class TypesChambre implements OnInit {
  columns: Column[] = [
    // { key: 'publicId', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé type chambre', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentType: TypeChambre | null = null;

  typeForm = {
    libelle: '',
  };

  constructor(private service: TypesChambreService) {}

  ngOnInit(): void {
    this.refresh();
  }

  types: TypeChambre[] = [];

  handleNew() {
    this.typeForm = { libelle: '' };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(type: any) {
    this.currentType = type;
    this.typeForm = { libelle: (type as TypeChambre).libelle };
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
      next: (data) => (this.types = data),
      error: () => toast.error('Erreur lors du chargement des types de chambre'),
    });
  }

  createType() {
    const { libelle } = this.typeForm;
    this.service.create(libelle!).subscribe(() => {
      toast.success('Type de chambre créé avec succès');
      this.showCreateModal = false;
      this.refresh();
    });
  }

  updateType() {
    if (this.currentType) {
      const { libelle } = this.typeForm;
      this.service.update(this.currentType.publicId, { libelle }).subscribe(() => {
        toast.success('Type de chambre mis à jour avec succès');
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
        toast.success('Type de chambre supprimé avec succès');
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
