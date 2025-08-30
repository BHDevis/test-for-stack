export interface Organization {
  id: number;
  name: string;
  director: string;
  phone: string;
}

export type SortField = 'name' | 'director';
export type SortDirection = 'asc' | 'desc';
