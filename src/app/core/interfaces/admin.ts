export interface Departement {
  id: string;
  libelle: string;
  nbPersonnels: number;
  updatedBy?: string;
}

export interface Profession {
  id: string;
  libelle: string;
  nbPersonnels: number;
  updatedBy?: string;
}

export interface Specialite {
  id: string;
  libelle: string;
  description: string;
  nbPersonnel: number;
  updatedBy?: string;
}

export interface Personnel {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  departement: string;
  profession: string;
  adresse: string;
  updatedBy?: string;
}

export interface Produit {
  id: string;
  libelle: string;
  description: string;
  prix: number;
  quantite: number;
  updatedBy?: string;
}