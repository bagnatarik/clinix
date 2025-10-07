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

export interface Etage {
  publicId: string;
  libelle: string;
}

export interface TypeChambre {
  publicId: string;
  libelle: string;
}

export interface TypePrelevement {
  publicId: string;
  libelle: string;
}

export interface TypeAntecedant {
  publicId: string;
  libelle: string;
}

export interface Analyse {
  publicId: string;
  libelle: string;
  cout: number;
}

export type LocalDate = string;

export interface Garde {
  publicId: string;
  dateDebut: LocalDate;
  heureDebut: string;
  dateFin: LocalDate;
  heureFin: string;
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

export interface Chambre {
  publicId: string;
  nomChambre: string;
  nombreLit: number;
  cout: number;
  libelleTypeChambre: string;
  libelleEtage: string;
}

export interface ChambreRequest {
  nomChambre: string;
  nombreLit: number;
  cout: number;
  idTypeChambre: string; // UUID
  idEtage: string; // UUID
}

// Planning
export interface PlanningResponse {
  publicId: string;
  libelle: string;
  nomPersonnel: string;
  dateDebutGarde: LocalDate;
  dateFinGarde: LocalDate;
}

export interface PlanningRequest {
  libelle: string;
  idPersonnel: string; // UUID
  idGarde: string; // UUID
}
