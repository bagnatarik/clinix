export interface Departement {
  publicId: string;
  libelle: string;
}

export interface Profession {
  publicId: string;
  libelle: string;
}

export interface Specialite {
  publicId: string;
  libelle: string;
}

export interface Personnel {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  publicId: string;
  libelleProfession: string;
  libelleSpecialite: string;
  libelleDepartement: string;
  // Optionnel: planning associé au personnel
  planning?: string;
  adresse: string;
  updatedBy?: string;
}

export interface PersonnelRequest {
  nom: string;
  prenom: string;
  dateNaissance: string; // ISO date string (YYYY-MM-DD)
  sexe: 'M' | 'F';
  telephone: string;
  email: string;
  adresse: string;
  idProfession: string; // UUID
  idSpecialite: string; // UUID
  idDepartement: string; // UUID
}

export interface Produit {
  id: string;
  nom: string;
  description: string;
  cout: number;
  updatedBy?: string;
}
