import { Component } from '@angular/core';
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
  styleUrl: './produits.css'
})
export class Produits {
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'libelle', label: 'Libellé produit', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'prix', label: 'Prix', sortable: true },
    { key: 'quantite', label: 'Quantité en stock', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;

  currentProduct: any = null;

  productForm = {
    id: '',
    libelle: '',
    description: '',
    prix: 0,
    quantite: 0,
  };

  produits: Produit[] = [];

  constructor(private service: ProduitsService) {}

  private refresh() {
    this.service.getAll().subscribe((data) => (this.produits = data));
  }

  handleNew() {
    this.productForm = { id: '', libelle: '', description: '', prix: 0, quantite: 0 };
    this.showCreateModal = true;
  }

  handleRefresh() { this.refresh(); }

  handleEdit(prod: any) {
    this.currentProduct = prod;
    this.productForm = { ...prod };
    this.showEditModal = true;
  }

  handleDelete(prod: any) {
    this.currentProduct = prod;
    this.showDeleteModal = true;
  }

  handleRowClick(prod: any) {
    console.log('Row clicked:', prod);
  }

  createProduct() {
    const { id, libelle, description, prix, quantite } = this.productForm;
    this.service
      .create({ id: id || undefined, libelle: libelle!, description: description!, prix: prix!, quantite: quantite! })
      .subscribe(() => {
        toast.success('Produit créé avec succès');
        this.showCreateModal = false;
        this.refresh();
      });
  }

  updateProduct() {
    if (this.currentProduct) {
      const { libelle, description, prix, quantite } = this.productForm;
      this.service
        .update(this.currentProduct.id, { libelle, description, prix, quantite })
        .subscribe(() => {
          toast.success('Produit mis à jour avec succès');
          this.showEditModal = false;
          this.refresh();
        });
    } else {
      this.showEditModal = false;
    }
  }

  deleteProduct() {
    if (this.currentProduct) {
      this.service.delete(this.currentProduct.id).subscribe(() => {
        toast.success('Produit supprimé avec succès');
        this.showDeleteModal = false;
        this.refresh();
      });
    } else {
      this.showDeleteModal = false;
    }
  }
}
