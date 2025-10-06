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
  specialite: string;
  departement: string;
  profession: string;
  // Optionnel: planning associé au personnel
  planning?: string;
  adresse: string;
  updatedBy?: string;
}

export interface Produit {
  id: string;
  nom: string;
  description: string;
  cout: number;
  updatedBy?: string;
}
