import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../../shared/data-table-component/data-table-component';
import { Column } from '../../core/interfaces/column';
import { toast } from 'ngx-sonner';
import { ProduitsService } from './produits.service';
import { Produit } from '../../core/interfaces/admin';

@Component({
  selector: 'app-produits',
  imports: [DataTableComponent, FormsModule],
  templateUrl: './produits.html',
  styleUrl: './produits.css',
})
export class Produits implements OnInit {
  columns: Column[] = [
    // { key: 'id', label: 'ID', sortable: true },
    { key: 'nom', label: 'Nom du produit', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'cout', label: 'Coût', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentProduct: any | null = null;

  productForm = {
    // id: '',
    nom: '',
    description: '',
    cout: 0,
  };

  produits: Produit[] = [];

  constructor(private service: ProduitsService) {}

  private refresh() {
    this.service.getAll().subscribe({
      next: (data) => (this.produits = data),
      error: () => toast.error('Échec du chargement des produits'),
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  handleNew() {
    this.productForm = { nom: '', description: '', cout: 0 };
    this.showCreateModal = true;
  }

  handleRefresh() {
    this.refresh();
  }

  handleEdit(prod: Produit) {
    this.currentProduct = prod;
    this.productForm = { ...prod };
    this.showEditModal = true;
  }

  handleDelete(prod: Produit) {
    this.currentProduct = prod;
    this.showDeleteModal = true;
  }

  handleRowClick(prod: Produit) {
    console.log('Row clicked:', prod);
  }

  createProduct() {
    const { nom, description, cout } = this.productForm;

    this.service.create({ nom: nom, description: description, cout: cout } as Produit).subscribe({
      next: () => {
        toast.success('Produit créé avec succès');
        this.showCreateModal = false;
        this.refresh();
      },
      error: () => toast.error('Échec de la création du produit'),
    });
  }

  updateProduct() {
    if (this.currentProduct) {
      const { nom, description, cout } = this.productForm;
      this.service.update(this.currentProduct.publicId, { nom, description, cout }).subscribe({
        next: () => {
          toast.success('Produit mis à jour avec succès');
          this.showEditModal = false;
          this.refresh();
        },
        error: () => toast.error('Échec de la mise à jour du produit'),
      });
    } else {
      this.showEditModal = false;
    }
  }

  deleteProduct() {
    if (this.currentProduct) {
      this.service.delete(this.currentProduct.publicId).subscribe({
        next: () => {
          toast.success('Produit supprimé avec succès');
          this.showDeleteModal = false;
          this.refresh();
        },
        error: () => toast.error('Échec de la suppression du produit'),
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
