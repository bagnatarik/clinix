export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date';
  sortable?: boolean;
}
