import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Column } from '../../core/interfaces/column';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './data-table-component.html',
  styleUrl: './data-table-component.css',
})
export class DataTableComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() searchable: boolean = true;
  @Input() paginated: boolean = true;
  @Input() itemsPerPage: number = 10;
  @Input() newButtonLabel: string = '+ New';
  @Input() tableName: string = 'Data table';
  @Input() showNewButton: boolean = true;
  @Input() manageUserAccount: boolean = false;
  @Input() showEditButton: boolean = true;
  @Input() showViewButton: boolean = false;
  @Input() showDeleteButton: boolean = true;
  @Input() canViewRow: (row: any) => boolean = () => true;

  @Output() onNew = new EventEmitter<void>();
  @Output() onRefresh = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onRowClick = new EventEmitter<any>();
  @Output() onViewProfile = new EventEmitter<any>();
  @Output() onResetPassword = new EventEmitter<any>();
  @Output() onFirstAppointmentAction = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  @Output() onActivateUser = new EventEmitter<any>();

  search: string = '';
  sortKey: string = '';
  sortAsc: boolean = true;
  currentPage: number = 1;

  get filteredData() {
    let filtered = this.data;

    // Recherche
    if (this.search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          val?.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    }

    // Tri
    if (this.sortKey) {
      filtered = filtered.sort((a, b) => {
        const aVal = a[this.sortKey];
        const bVal = b[this.sortKey];
        return this.sortAsc ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
      });
    }

    // Pagination
    if (this.paginated) {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(start, start + this.itemsPerPage);
    }

    return filtered;
  }

  sort(key: string) {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
  }

  totalPages(): number {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getVisiblePages(): number[] {
    const totalPages = this.totalPages();
    const visiblePages: number[] = [];

    // Show up to 5 pages at a time
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust start page if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  }

  hasEmailColumn(columns: Column[]): boolean {
    return columns.some((col) => col.key === 'email');
  }
}
