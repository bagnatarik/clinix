import { Component, OnInit } from '@angular/core';
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
  styleUrl: './departements.css',
})
export class Departements implements OnInit {
  columns: Column[] = [
    { key: 'publicId', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé département', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentDept: any = null;

  deptForm = {
    publicId: '',
    libelle: '',
  };

  handleNew() {
    this.deptForm = { publicId: '', libelle: '' };
    this.showCreateModal = true;
  }

  constructor(private service: DepartementsService) {}

  departements: Departement[] = [];

  handleRefresh() {
    this.refresh();
  }
  private refresh() {
    this.service.getAll().subscribe((list) => (this.departements = list));
  }

  ngOnInit(): void {
    this.refresh();
  }

  handleEdit(dept: any) {
    this.currentDept = dept;
    this.deptForm = { publicId: dept.publicId ?? '', libelle: dept.libelle ?? '' };
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
    const { libelle } = this.deptForm;
    this.service.create({ publicId: 'UNID', libelle: libelle! }).subscribe(() => {
      this.showCreateModal = false;
      this.refresh();
    });
  }

  updateDept() {
    if (this.currentDept) {
      const { libelle } = this.deptForm;
      this.service.update(this.currentDept.publicId, { libelle }).subscribe(() => {
        this.showEditModal = false;
        this.refresh();
      });
    } else {
      this.showEditModal = false;
    }
  }

  deleteDept() {
    if (this.currentDept) {
      this.service.delete(this.currentDept.publicId).subscribe(() => {
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
