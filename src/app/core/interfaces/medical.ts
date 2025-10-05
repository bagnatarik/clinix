export interface Consultation {
  id: string;
  patient: string;
  date: string; // ISO date string
  motif: string;
  statut: 'planifiée' | 'terminée' | 'annulée';
  // Champs additionnels pour l’affichage demandé
  typeConsultation?: string;
  description?: string;
  cout?: number;
  poids?: number;
  temperature?: number;
  tension?: string;
  // Diagnostics cliniques saisis dans le formulaire de consultation
  diagnostics?: { maladie: string; details?: string; gravite?: string }[];
  // Analyses médicales demandées pendant la consultation
  analyses?: {
    nomAnalyse: string;
    dateAnalyse: string; // ISO date string
    description?: string;
    typeAnalyse?: string;
    diagnosticRef: string;
  }[];
  // Prescriptions liées aux diagnostics durant la consultation
  prescriptions?: {
    date: string; // ISO date string
    description?: string;
    motif?: string;
    diagnosticRef: string;
  }[];
  // Hospitalisations liées aux diagnostics durant la consultation
  hospitalisations?: {
    dateAdmission: string; // ISO date string
    dateSortie?: string; // ISO date string
    motif?: string;
    diagnosticRef: string;
  }[];
}

export interface Diagnostic {
  id: string;
  patient: string;
  date: string; // ISO date string
  // Harmonisation avec l’UI Diagnostics
  // Conserve `resultat` pour compatibilité rétroactive
  resultat?: string;
  maladie?: string;
  details?: string;
  gravite?: string;
  statut: 'en attente' | 'confirmé' | 'annulé';
}

export interface Prescription {
  id: string;
  patient: string;
  date: string; // ISO date string
  statut: 'brouillon' | 'validée' | 'annulée';
  // Harmonisation avec l’UI: colonnes "motif" et "description"
  // Conserve `details` pour compatibilité rétroactive
  details?: string;
  motif?: string;
  description?: string;
}

export interface Hospitalisation {
  id: string;
  patient: string;
  admissionDate: string; // ISO date string
  service: string;
  statut: 'en cours' | 'sorti' | 'annulé';
  // Champs additionnels pour l’affichage infirmier
  dischargeDate?: string; // ISO date string
  motif?: string;
  diagnostique?: string;
  chambre?: string;
}

export interface Ordonnance {
  id: string;
  patient: string;
  date: string; // ISO date string
  contenu?: string;
  statut: 'brouillon' | 'signée' | 'annulée';
  // Nouveau modèle pour Ordonnances
  libelle?: string;
  coutTotal?: number;
  produits?: {
    nom: string;
    description?: string;
    cout?: number;
    prixProduit?: number;
  }[];
}