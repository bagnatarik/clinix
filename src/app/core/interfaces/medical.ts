export interface Consultation {
  id: string;
  patient: string;
  date: string; // ISO date string
  motif: string;
  statut: 'planifiée' | 'terminée' | 'annulée' | 'signée' | 'brouillon';
  // Champs additionnels pour l’affichage demandé
  typeConsultation?: string;
  description?: string;
  cout?: number;
  poids?: number;
  temperature?: number;
  tension?: number;
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

export interface Rendezvous {
  id: string;
  date: string; // ISO date string
  heure: string; // HH:mm
  patient: string;
  personnel: string; // assigné côté infirmier/doctor
  statut: 'planifié' | 'honoré' | 'annulé';
  motif?: string;
}

// Dossier Patient (DTO Backend)
export interface DossierPatientResponse {
  publicId: string; // UUID
  code: string;
  dateCreation: string; // LocalDate (ISO string)
  nomPatient: string;
}

// Nouveau schéma Consultations (DTO Backend)
export interface ConsultationResponse {
  publicId: string; // UUID
  consultationDate: string; // LocalDate (ISO string)
  consultationType: string;
  consultationDescription: string;
  consultationStatus: string;
  coutConsultation: number;
  poids: number;
  temperature: number;
  tension: number;
  codeDossierPatient: string;
  nomPersonnel: string;
}

export interface ConsultationRequest {
  consultationType: string;
  consultationDescription: string;
  consultationStatus: string;
  coutConsultation: number;
  poids: number;
  temperature: number;
  tension: number;
  idPersonnel: string; // UUID
  idDossierPatient: string; // UUID
}

// Patient (DTO Backend)
export type Sexe = 'H' | 'F';

export interface PatientResponse {
  publicId: string; // UUID
  numeroDossier: string;
  dossierPublicId: string;
  nom: string;
  prenom: string;
  dateNaissance: string; // LocalDate (ISO string)
  sexe: Sexe;
  telephone: string;
  email: string;
  adresse: string;
}

export interface PatientRequest {
  nom: string;
  prenom: string;
  dateNaissance: string; // LocalDate (ISO string)
  sexe: Sexe;
  telephone: string;
  email: string;
  adresse: string;
}

// Antécédent (DTO Backend)
export interface AntecedentRequest {
  description: string;
  idTypeAntecedant: string; // UUID
  dossierPatient: string; // UUID
}

export interface AntecedentResponse {
  publicId: string; // UUID
  description: string;
  libelleTypeAntecedant: string;
  codeDossierPatient: string;
}

// Prescription (DTO Backend)
export interface PrescriptionRequest {
  motif: string;
  description: string;
  idDiagnostique: string; // UUID
}

export interface PrescriptionResponse {
  publicId: string; // UUID
  datePrescription: string; // LocalDate (ISO string)
  motif: string;
  description: string;
  diagnostiquePublicId: string; // UUID
}

// Diagnostique (DTO Backend)
export interface DiagnostiqueRequest {
  maladie: string;
  details: string;
  niveauGravite: string;
  idConsultation: string; // UUID
}

export interface DiagnostiqueResponse {
  publicId: string; // UUID
  maladie: string;
  details: string;
  niveauGravite: string;
  consultationPublicId: string; // UUID
}

// Hospitalisation (DTO Backend)
export interface HospitalisationRequest {
  dateSortie?: string; // LocalDate (ISO string)
  motif: string;
  idDiagnostique: string; // UUID
  idChambre: string; // UUID
}

export interface HospitalisationResponse {
  publicId: string; // UUID
  dateAdmis: string; // LocalDate (ISO string)
  dateSortie?: string; // LocalDate (ISO string)
  motif: string;
  diagnostiqueId: string; // UUID
  nomChambre: string;
}

// Analyse Médicale (DTO Backend)
export interface AnalyseMedicaleRequest {
  nomAnalyseMedicale: string;
  dateAnalyseMedicale: string; // LocalDate (ISO string)
  description: string;
  idAnalyse: string; // UUID
  idDiagnostique: string; // UUID
}

export interface AnalyseMedicaleResponse {
  publicId: string; // UUID
  nomAnalyseMedicale: string;
  dateAnalyseMedicale: string; // LocalDate (ISO string)
  description: string;
  diagnostiquePublicId: string; // UUID
  libelleAnalyse: string;
}
