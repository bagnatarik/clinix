export interface Consultation {
  id: string;
  patient: string;
  date: string; // ISO date string
  motif: string;
  statut: 'planifiée' | 'terminée' | 'annulée';
}

export interface Diagnostic {
  id: string;
  patient: string;
  date: string; // ISO date string
  resultat: string;
  statut: 'en attente' | 'confirmé' | 'annulé';
}

export interface Prescription {
  id: string;
  patient: string;
  date: string; // ISO date string
  details: string;
  statut: 'brouillon' | 'validée' | 'annulée';
}

export interface Hospitalisation {
  id: string;
  patient: string;
  admissionDate: string; // ISO date string
  service: string;
  statut: 'en cours' | 'sorti' | 'annulé';
}

export interface Ordonnance {
  id: string;
  patient: string;
  date: string; // ISO date string
  contenu: string;
  statut: 'brouillon' | 'signée' | 'annulée';
}