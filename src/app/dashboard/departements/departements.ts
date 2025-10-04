import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';
import { DepartementsService } from './departements.service';
import { Departement } from '../../core/interfaces/admin';

@Component({
  selector: 'app-departements',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './departements.html',
  styleUrl: './departements.css'
})
export class Departements {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé département', sortable: true },
    { key: 'nbPersonnels', label: 'Nombre de personnels', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentDept: any = null;

  deptForm = {
    id: '',
    libelle: '',
    nbPersonnels: 0,
  };

  handleNew() {
    this.deptForm = { id: '', libelle: '', nbPersonnels: 0 };
    this.showCreateModal = true;
  }

  constructor(private service: DepartementsService) {}

  departements: Departement[] = [];

  handleRefresh() { this.refresh(); }
  private refresh() {
    this.service.getAll().subscribe((list) => (this.departements = list));
  }

  handleEdit(dept: any) {
    this.currentDept = dept;
    this.deptForm = { ...dept };
    this.showEditModal = true;
  }

  handleDelete(dept: any) {
    this.currentDept = dept;
    this.showDeleteModal = true;
  }

  handleRowClick(dept: any) {
    console.log('Row clicked:', dept);
  }

  createDept() {
    const { id, libelle, nbPersonnels } = this.deptForm;
    this.service
      .create({ id: id || undefined, libelle: libelle!, nbPersonnels: Number(nbPersonnels) })
      .subscribe(() => {
        this.showCreateModal = false;
        this.refresh();
      });
  }

  updateDept() {
    if (this.currentDept) {
      const { libelle, nbPersonnels } = this.deptForm;
      this.service
        .update(this.currentDept.id, { libelle, nbPersonnels: Number(nbPersonnels) })
        .subscribe(() => {
          this.showEditModal = false;
          this.refresh();
        });
    } else {
      this.showEditModal = false;
    }
  }

  deleteDept() {
    if (this.currentDept) {
      this.service.delete(this.currentDept.id).subscribe(() => {
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
