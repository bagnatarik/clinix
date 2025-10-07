import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnalysesService } from '../analyses.service';
import { Analyse } from '../../../../core/interfaces/admin';

@Component({
  selector: 'app-analyses-list-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, ReactiveFormsModule],
  template: `
    <app-data-table-component
      [columns]="columns"
      [data]="analyses"
      [tableName]="'Analyses'"
      [searchable]="true"
      [paginated]="true"
      [itemsPerPage]="10"
      [newButtonLabel]="'Nouvelle analyse'"
      [showNewButton]="true"
      (onNew)="handleNew()"
      (onEdit)="handleEdit($event)"
      (onDelete)="handleDelete($event)"
      (onRefresh)="handleRefresh()"
    ></app-data-table-component>

    <!-- Modal Création (style Départements) -->
    <div
      *ngIf="showCreateModal"
      class="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
      (click)="closeCreateModal()"
    >
      <div class="bg-white rounded p-5 w-96 shadow-md" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-800">Ajouter une analyse</h2>
          <button
            (click)="closeCreateModal()"
            class="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form [formGroup]="formCreate" (ngSubmit)="createAnalyse()">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-600 mb-1">Libellé analyse</label>
              <input
                formControlName="libelle"
                type="text"
                class="w-full px-3 py-1.5 border border-gray-200 rounded focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-600 mb-1">Coût</label>
              <input
                formControlName="cout"
                type="number"
                class="w-full px-3 py-1.5 border border-gray-200 rounded focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-5">
            <button
              type="button"
              (click)="closeCreateModal()"
              class="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="formCreate.invalid"
              class="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Édition (style Départements) -->
    <div
      *ngIf="showEditModal"
      class="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
      (click)="closeEditModal()"
    >
      <div class="bg-white rounded p-5 w-96 shadow-md" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-800">Modifier une analyse</h2>
          <button
            (click)="closeEditModal()"
            class="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form [formGroup]="formEdit" (ngSubmit)="updateAnalyse()">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-600 mb-1">Libellé analyse</label>
              <input
                formControlName="libelle"
                type="text"
                class="w-full px-3 py-1.5 border border-gray-200 rounded focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
            <div class="col-span-2">
              <label class="block text-xs font-medium text-gray-600 mb-1">Coût</label>
              <input
                formControlName="cout"
                type="number"
                class="w-full px-3 py-1.5 border border-gray-200 rounded focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-2 mt-5">
            <button
              type="button"
              (click)="closeEditModal()"
              class="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="formEdit.invalid"
              class="px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Suppression (style Départements) -->
    <div
      *ngIf="showDeleteModal"
      class="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
      (click)="closeDeleteModal()"
    >
      <div class="bg-white rounded p-5 w-96 shadow-md" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-lg font-medium text-gray-800">Supprimer l'analyse</h2>
          <button
            (click)="closeDeleteModal()"
            class="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-4"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <p class="text-sm text-gray-500 mb-4">
          Confirmez la suppression de <strong>{{ currentItem?.libelle }}</strong
          >.
        </p>
        <div class="flex justify-end space-x-2">
          <button
            (click)="closeDeleteModal()"
            class="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            (click)="deleteAnalyse()"
            class="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AnalysesListAdminComponent {
  columns: Column[] = [
    // { key: 'publicId', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé', sortable: true },
    { key: 'cout', label: 'Coût', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  analyses: Analyse[] = [];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  currentItem: any | null = null;
  formCreate: FormGroup;
  formEdit: FormGroup;

  constructor(private fb: FormBuilder, private service: AnalysesService) {
    this.formCreate = this.fb.group({
      libelle: ['', Validators.required],
      cout: [null, [Validators.required, Validators.min(0)]],
    });
    this.formEdit = this.fb.group({
      libelle: ['', Validators.required],
      cout: [null, [Validators.required, Validators.min(0)]],
    });
  }

  handleRefresh() {
    this.refresh();
  }

  ngOnInit() {
    this.refresh();
  }

  private refresh() {
    this.service.getAll().subscribe((list) => {
      this.analyses = list || [];
    });
  }

  // Create modal controls
  handleNew() {
    this.formCreate.reset({ libelle: '', cout: null });
    this.showCreateModal = true;
  }
  closeCreateModal() {
    this.showCreateModal = false;
  }
  createAnalyse() {
    if (this.formCreate.invalid) return;
    const { libelle, cout } = this.formCreate.value;
    this.service.create(libelle, cout).subscribe(() => {
      this.closeCreateModal();
      this.refresh();
    });
  }

  // Edit modal controls
  handleEdit(row: any) {
    this.currentItem = row as Analyse;
    this.formEdit.reset({ libelle: (row as Analyse).libelle, cout: (row as Analyse).cout });
    this.showEditModal = true;
  }
  closeEditModal() {
    this.showEditModal = false;
    this.currentItem = null;
  }
  updateAnalyse() {
    if (this.formEdit.invalid || !this.currentItem) return;
    const { libelle, cout } = this.formEdit.value;
    this.service.update((this.currentItem as Analyse).publicId, { libelle, cout }).subscribe(() => {
      this.closeEditModal();
      this.refresh();
    });
  }

  handleDelete(row: any) {
    this.currentItem = row;
    this.showDeleteModal = true;
  }
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.currentItem = null;
  }
  deleteAnalyse() {
    if (!this.currentItem) return;
    this.service.delete((this.currentItem as Analyse).publicId).subscribe(() => {
      this.closeDeleteModal();
      this.refresh();
    });
  }
}
