import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Ordonnance } from '../../../../core/interfaces/medical';
import { OrdonnancesService } from '../ordonnances.service';
import { DataTableComponent } from '../../../../shared/data-table-component/data-table-component';
import { Column } from '../../../../core/interfaces/column';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitsService } from '../../../produits/produits.service';
import { Produit } from '../../../../core/interfaces/admin';

@Component({
  selector: 'app-ordonnances-view',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './ordonnances-view.component.html',
})
export class OrdonnancesViewComponent implements OnInit {
  ordonnance$!: Observable<Ordonnance | null>;
  productColumns: Column[] = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'prixProduit', label: 'Prix produit', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];
  // Colonnes sans actions (utilisées si l’ordonnance est signée)
  productColumnsSigned: Column[] = this.productColumns.filter((c) => c.key !== 'actions');

  showProductModal = false;
  productForm!: FormGroup;
  produitsOptions: Produit[] = [];
  editingIndex: number | null = null;
  currentOrdonnance?: Ordonnance | null;
  // Confirmation suppression
  showDeleteModal = false;
  productToDelete: any = null;
  // Dropdown produit (style custom avec recherche)
  produitDropdownOpen = false;
  produitSearch = '';
  produitActiveIndex: number = -1;
  @ViewChild('produitSearchInput') produitSearchRef?: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private service: OrdonnancesService,
    private produitsService: ProduitsService,
    private fb: FormBuilder,
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    this.ordonnance$ = id ? this.service.getById(id) : of(null);
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      produitId: ['', Validators.required],
    });

    // Charger les options de produits
    this.produitsService.getAll().subscribe((list) => (this.produitsOptions = list));

    // Suivre l'ordonnance courante pour mises à jour locales
    this.ordonnance$.subscribe((o) => (this.currentOrdonnance = o));
  }

  addProduct(): void {
    if (this.isOrdonnanceSigned()) return;
    this.openProductModal();
  }

  editProduct(row: any): void {
    const idx = (this.currentOrdonnance?.produits || []).findIndex((p) => p === row);
    this.openProductModal(idx, row);
  }

  deleteProduct(row: any): void {
    if (this.isOrdonnanceSigned()) return;
    this.productToDelete = row;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.currentOrdonnance || !this.productToDelete) {
      this.showDeleteModal = false;
      this.productToDelete = null;
      return;
    }
    const produits = [...(this.currentOrdonnance.produits || [])];
    const idx = produits.findIndex((p) => p === this.productToDelete);
    if (idx >= 0) {
      produits.splice(idx, 1);
      const coutTotal = this.recalcTotal(produits);
      this.service.update(this.currentOrdonnance.id, { produits, coutTotal }).subscribe((updated) => {
        if (updated) {
          this.currentOrdonnance = updated;
          this.ordonnance$ = of(updated);
        }
        this.showDeleteModal = false;
        this.productToDelete = null;
      });
    } else {
      this.showDeleteModal = false;
      this.productToDelete = null;
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  openProductModal(index?: number, row?: any): void {
    this.editingIndex = index !== undefined ? index : null;
    // Pré-sélectionner si possible via le nom
    const match = row ? this.produitsOptions.find((p) => p.nom === row.nom) : undefined;
    this.productForm.reset({ produitId: match?.id || '' });
    this.showProductModal = true;
    // réinitialiser dropdown local
    this.produitDropdownOpen = false;
    this.produitSearch = '';
    this.produitActiveIndex = -1;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.productForm.reset({ produitId: '' });
    this.editingIndex = null;
  }

  saveProduct(): void {
    if (!this.currentOrdonnance) return;
    if (this.isOrdonnanceSigned()) return;
    if (this.productForm.invalid) return;
    const produitId = this.productForm.value.produitId as string;
    const selected = this.produitsOptions.find((p) => p.id === produitId);
    if (!selected) return;

    const newLine = {
      nom: selected.nom,
      description: selected.description,
      prixProduit: selected.cout,
    };

    const produits = [...(this.currentOrdonnance.produits || [])];
    if (this.editingIndex !== null && this.editingIndex >= 0 && this.editingIndex < produits.length) {
      produits[this.editingIndex] = { ...produits[this.editingIndex], ...newLine };
    } else {
      produits.push(newLine as any);
    }

    const coutTotal = this.recalcTotal(produits);
    this.service.update(this.currentOrdonnance.id, { produits, coutTotal }).subscribe((updated) => {
      if (updated) {
        this.currentOrdonnance = updated;
        this.ordonnance$ = of(updated);
        this.closeProductModal();
      }
    });
  }

  private recalcTotal(produits: Array<{ prixProduit?: number; cout?: number }>): number {
    return produits.reduce((sum, p) => sum + (Number(p.prixProduit) || Number(p.cout) || 0), 0);
  }

  // Interdictions si l’ordonnance est signée
  private isOrdonnanceSigned(): boolean {
    return (this.currentOrdonnance?.statut === 'signée');
  }

  // Helpers dropdown produit
  getProduitName(id: string | number | null | undefined): string {
    if (id === null || id === undefined || id === '') return '';
    const found = this.produitsOptions.find((p) => p.id === id);
    return found?.nom || '';
  }

  get filteredProduits(): Produit[] {
    const q = this.produitSearch.trim().toLowerCase();
    if (!q) return this.produitsOptions;
    return this.produitsOptions.filter(
      (p) => p.nom.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }

  toggleProduitDropdown(): void {
    this.produitDropdownOpen = !this.produitDropdownOpen;
    if (this.produitDropdownOpen) {
      const list = this.filteredProduits;
      const currentId = (this.productForm.get('produitId')?.value as string) || '';
      const idx = list.findIndex((p) => p.id === currentId);
      this.produitActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
      setTimeout(() => this.produitSearchRef?.nativeElement.focus(), 0);
    }
  }

  selectProduit(p: Produit): void {
    this.productForm.get('produitId')?.setValue(p.id, { emitEvent: true });
    this.produitDropdownOpen = false;
  }

  // Mise à jour manuelle de l’ordonnance (si non signée)
  updateOrdonnance(): void {
    if (!this.currentOrdonnance) return;
    if (this.isOrdonnanceSigned()) return;
    const produits = [...(this.currentOrdonnance.produits || [])];
    const coutTotal = this.recalcTotal(produits);
    this.service.update(this.currentOrdonnance.id, { produits, coutTotal }).subscribe((updated) => {
      if (updated) {
        this.currentOrdonnance = updated;
        this.ordonnance$ = of(updated);
      }
    });
  }

  // Impression de l’ordonnance (imprime la page actuelle)
  printOrdonnance(): void {
    window.print();
  }
}