import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Consultation,
  Diagnostic,
  Prescription,
  Hospitalisation,
  Ordonnance,
} from '../interfaces/medical';
import { Departement, Profession, Specialite, Personnel, Produit } from '../interfaces/admin';

@Injectable({ providedIn: 'root' })
export class InMemoryDatabaseService {
  // Seed unique patients across modules for coherence
  private consultations: Consultation[] = [
    {
      id: 'CONS-001',
      patient: 'Alice Dubois',
      date: '2025-10-03',
      motif: 'Contrôle de routine',
      statut: 'planifiée',
      typeConsultation: 'Suivi général',
      description: 'Bilan clinique et prévention',
      cout: 300,
      poids: 72.5,
      temperature: 37.2,
      tension: '12/8',
    },
    {
      id: 'CONS-002',
      patient: 'Jean Dupont',
      date: '2025-10-04',
      motif: 'Douleur abdominale',
      statut: 'terminée',
      typeConsultation: 'Urgence',
      description: 'Douleur abdominale aiguë avec fièvre',
      cout: 450,
      poids: 80.0,
      temperature: 38.5,
      tension: '13/9',
    },
  ];

  private diagnostics: Diagnostic[] = [
    {
      id: 'DIAG-001',
      patient: 'Alice Dubois',
      date: '2025-10-03',
      // Nouvelles colonnes alignées avec l’UI
      maladie: 'Hypertension',
      details: 'NFS normale; TA élevée, céphalées',
      gravite: 'modéré',
      // Compatibilité rétroactive
      resultat: 'NFS normale',
      statut: 'confirmé',
    },
    {
      id: 'DIAG-002',
      patient: 'Jean Dupont',
      date: '2025-10-04',
      maladie: 'Infection',
      details: 'CRP élevée',
      gravite: 'sévère',
      resultat: 'CRP élevée',
      statut: 'en attente',
    },
  ];

  private prescriptions: Prescription[] = [
    {
      id: 'PRES-001',
      patient: 'Alice Dubois',
      date: '2025-10-03',
      details: 'Paracétamol 500mg',
      motif: 'Contrôle de routine',
      description: 'Paracétamol 500mg',
      statut: 'validée',
    },
    {
      id: 'PRES-002',
      patient: 'Jean Dupont',
      date: '2025-10-04',
      details: 'Ibuprofène 200mg',
      motif: 'Douleur abdominale',
      description: 'Ibuprofène 200mg',
      statut: 'brouillon',
    },
  ];

  private hospitalisations: Hospitalisation[] = [
    {
      id: 'HOSP-001',
      patient: 'Alice Dubois',
      admissionDate: '2025-10-05',
      service: 'Chirurgie',
      statut: 'en cours',
      dischargeDate: '2025-10-07',
      motif: 'Surveillance post-opératoire',
      diagnostique: 'Appendicite aiguë',
      chambre: 'A-101',
    },
    {
      id: 'HOSP-002',
      patient: 'Jean Dupont',
      admissionDate: '2025-10-06',
      service: 'Médecine Interne',
      statut: 'sorti',
      dischargeDate: '2025-10-08',
      motif: 'Observation clinique',
      diagnostique: 'CRP élevée',
      chambre: 'B-201',
    },
  ];

  private ordonnances: Ordonnance[] = [
    {
      id: 'ORD-001',
      patient: 'Alice Dubois',
      date: '2025-10-03',
      statut: 'signée',
      libelle: 'Antibiotiques 7 jours',
      coutTotal: 20.5,
      produits: [
        { nom: 'Amoxicilline', description: '500 mg 3x/j', prixProduit: 12.0 },
        { nom: 'Probiotiques', description: 'Soutien flore', prixProduit: 8.5 },
      ],
    },
    {
      id: 'ORD-002',
      patient: 'Jean Dupont',
      date: '2025-10-04',
      statut: 'brouillon',
      libelle: 'Vitamine D 3 mois',
      coutTotal: 15.0,
      produits: [
        { nom: 'Vitamine D3', description: '1000 UI quotidienne', prixProduit: 9.0 },
        { nom: 'Calcium', description: '500 mg', prixProduit: 6.0 },
      ],
    },
  ];

  // Admin: Départements
  private departements: Departement[] = [
    { id: 'CARD', libelle: 'Cardiologie' },
    { id: 'ONC', libelle: 'Oncologie' },
    { id: 'PED', libelle: 'Pédiatrie' },
  ];

  // Admin: Professions
  private professions: Profession[] = [
    { id: 'med', libelle: 'Médecin', nbPersonnels: 12 },
    { id: 'inf', libelle: 'Infirmier/Infirmière', nbPersonnels: 25 },
    { id: 'kine', libelle: 'Kinésithérapeute', nbPersonnels: 8 },
    { id: 'sec', libelle: 'Secrétaire médical(e)', nbPersonnels: 6 },
    { id: 'tech', libelle: 'Technicien de laboratoire', nbPersonnels: 4 },
  ];

  // Admin: Spécialités
  private specialites: Specialite[] = [
    { id: 'cardio', libelle: 'Cardiologie', description: 'Spécialité médicale qui traite des affections du cœur et des vaisseaux', nbPersonnel: 5 },
    { id: 'derma', libelle: 'Dermatologie', description: "Spécialité médicale qui s'occupe de la peau, des muqueuses et des phanères", nbPersonnel: 3 },
    { id: 'neuro', libelle: 'Neurologie', description: 'Spécialité médicale qui étudie et traite les maladies du système nerveux', nbPersonnel: 4 },
    { id: 'ophtalmo', libelle: 'Ophtalmologie', description: 'Spécialité médicale qui traite des maladies des yeux et de la vision', nbPersonnel: 2 },
    { id: 'pediatrie', libelle: 'Pédiatrie', description: 'Spécialité médicale qui étudie le développement et soigne les enfants', nbPersonnel: 6 },
  ];

  // Admin: Personnels
  private personnels: Personnel[] = [
    {
      id: 'DUPJE01',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@clinix.com',
      telephone: '+33 6 12 34 56 78',
      specialite: 'Cardiologie',
      departement: 'Médecine',
      profession: 'Docteur',
      adresse: '12 rue de la Santé, Paris',
    },
    {
      id: 'MARAN02',
      nom: 'Martin',
      prenom: 'Anne',
      email: 'anne.martin@clinix.com',
      telephone: '+33 6 98 76 54 32',
      specialite: 'Pédiatrie',
      departement: 'Médecine',
      profession: 'Docteur',
      adresse: '5 avenue des Enfants, Lyon',
    },
    {
      id: 'LECPI03',
      nom: 'Leclerc',
      prenom: 'Pierre',
      email: 'pierre.leclerc@clinix.com',
      telephone: '+33 7 11 22 33 44',
      specialite: 'Soins infirmiers',
      departement: 'Soins',
      profession: 'Infirmier',
      adresse: '10 boulevard de la Paix, Marseille',
    },
    {
      id: 'DURMA04',
      nom: 'Durand',
      prenom: 'Marie',
      email: 'marie.durand@clinix.com',
      telephone: '+33 6 55 66 77 88',
      specialite: 'Analyses',
      departement: 'Laboratoire',
      profession: 'Laborantin',
      adresse: '22 chemin des Sciences, Toulouse',
    },
  ];

  // Admin: Produits
  private produits: Produit[] = [
    { id: 'PRD001', nom: 'Seringue', description: 'Seringue stérile 5ml', cout: 1.5 },
    { id: 'PRD002', nom: 'Gants', description: 'Gants nitrile taille M', cout: 0.2 },
    { id: 'PRD003', nom: 'Masque', description: 'Masque chirurgical', cout: 0.5 },
  ];

  // Consultations
  getConsultations(): Observable<Consultation[]> {
    return of([...this.consultations]);
  }
  getConsultationById(id: string): Observable<Consultation | null> {
    return of(this.consultations.find((c) => c.id === id) || null);
  }
  createConsultation(item: Omit<Consultation, 'id'>): Observable<Consultation> {
    const id = `CONS-${String(this.consultations.length + 1).padStart(3, '0')}`;
    const created = { id, ...item };
    this.consultations.push(created);
    return of(created);
  }
  updateConsultation(id: string, changes: Partial<Consultation>): Observable<Consultation | null> {
    const idx = this.consultations.findIndex((c) => c.id === id);
    if (idx === -1) return of(null);
    this.consultations[idx] = { ...this.consultations[idx], ...changes };
    return of(this.consultations[idx]);
  }
  deleteConsultation(id: string): Observable<boolean> {
    const initial = this.consultations.length;
    this.consultations = this.consultations.filter((c) => c.id !== id);
    return of(this.consultations.length < initial);
  }

  // Diagnostics
  getDiagnostics(): Observable<Diagnostic[]> {
    return of([...this.diagnostics]);
  }
  createDiagnostic(item: Omit<Diagnostic, 'id'>): Observable<Diagnostic> {
    const id = `DIAG-${String(this.diagnostics.length + 1).padStart(3, '0')}`;
    const created = { id, ...item };
    this.diagnostics.push(created);
    return of(created);
  }
  updateDiagnostic(id: string, changes: Partial<Diagnostic>): Observable<Diagnostic | null> {
    const idx = this.diagnostics.findIndex((x) => x.id === id);
    if (idx === -1) return of(null);
    this.diagnostics[idx] = { ...this.diagnostics[idx], ...changes };
    return of(this.diagnostics[idx]);
  }
  deleteDiagnostic(id: string): Observable<boolean> {
    const initial = this.diagnostics.length;
    this.diagnostics = this.diagnostics.filter((x) => x.id !== id);
    return of(this.diagnostics.length < initial);
  }

  // Prescriptions
  getPrescriptions(): Observable<Prescription[]> {
    return of([...this.prescriptions]);
  }
  getPrescriptionById(id: string): Observable<Prescription | null> {
    return of(this.prescriptions.find((x) => x.id === id) || null);
  }
  createPrescription(item: Omit<Prescription, 'id'>): Observable<Prescription> {
    const id = `PRES-${String(this.prescriptions.length + 1).padStart(3, '0')}`;
    const created = { id, ...item };
    this.prescriptions.push(created);
    return of(created);
  }
  updatePrescription(id: string, changes: Partial<Prescription>): Observable<Prescription | null> {
    const idx = this.prescriptions.findIndex((x) => x.id === id);
    if (idx === -1) return of(null);
    this.prescriptions[idx] = { ...this.prescriptions[idx], ...changes };
    return of(this.prescriptions[idx]);
  }
  deletePrescription(id: string): Observable<boolean> {
    const initial = this.prescriptions.length;
    this.prescriptions = this.prescriptions.filter((x) => x.id !== id);
    return of(this.prescriptions.length < initial);
  }

  // Hospitalisations
  getHospitalisations(): Observable<Hospitalisation[]> {
    return of([...this.hospitalisations]);
  }
  createHospitalisation(item: Omit<Hospitalisation, 'id'>): Observable<Hospitalisation> {
    const id = `HOSP-${String(this.hospitalisations.length + 1).padStart(3, '0')}`;
    const created = { id, ...item };
    this.hospitalisations.push(created);
    return of(created);
  }
  updateHospitalisation(
    id: string,
    changes: Partial<Hospitalisation>
  ): Observable<Hospitalisation | null> {
    const idx = this.hospitalisations.findIndex((x) => x.id === id);
    if (idx === -1) return of(null);
    this.hospitalisations[idx] = { ...this.hospitalisations[idx], ...changes };
    return of(this.hospitalisations[idx]);
  }
  deleteHospitalisation(id: string): Observable<boolean> {
    const initial = this.hospitalisations.length;
    this.hospitalisations = this.hospitalisations.filter((x) => x.id !== id);
    return of(this.hospitalisations.length < initial);
  }

  // Ordonnances
  getOrdonnances(): Observable<Ordonnance[]> {
    return of([...this.ordonnances]);
  }
  getOrdonnanceById(id: string): Observable<Ordonnance | null> {
    return of(this.ordonnances.find((x) => x.id === id) || null);
  }
  createOrdonnance(item: Omit<Ordonnance, 'id'>): Observable<Ordonnance> {
    const id = `ORD-${String(this.ordonnances.length + 1).padStart(3, '0')}`;
    const created = { id, ...item };
    this.ordonnances.push(created);
    return of(created);
  }
  updateOrdonnance(id: string, changes: Partial<Ordonnance>): Observable<Ordonnance | null> {
    const idx = this.ordonnances.findIndex((x) => x.id === id);
    if (idx === -1) return of(null);
    this.ordonnances[idx] = { ...this.ordonnances[idx], ...changes };
    return of(this.ordonnances[idx]);
  }
  deleteOrdonnance(id: string): Observable<boolean> {
    const initial = this.ordonnances.length;
    this.ordonnances = this.ordonnances.filter((x) => x.id !== id);
    return of(this.ordonnances.length < initial);
  }

  // Départements
  getDepartements(): Observable<Departement[]> {
    return of([...this.departements]);
  }
  createDepartement(item: Omit<Departement, 'id'> & { id?: string; updatedBy?: string }): Observable<Departement> {
    const newItem: Departement = { id: item.id ?? `DEP${Math.floor(Math.random() * 1000)}`, ...item } as Departement;
    this.departements = [newItem, ...this.departements];
    return of(newItem);
  }
  updateDepartement(id: string, changes: Partial<Departement>): Observable<Departement | null> {
    const idx = this.departements.findIndex((d) => d.id === id);
    if (idx === -1) return of(null);
    this.departements[idx] = { ...this.departements[idx], ...changes };
    return of(this.departements[idx]);
  }
  deleteDepartement(id: string): Observable<boolean> {
    const initial = this.departements.length;
    this.departements = this.departements.filter((d) => d.id !== id);
    return of(this.departements.length < initial);
  }

  // Professions
  getProfessions(): Observable<Profession[]> {
    return of([...this.professions]);
  }
  createProfession(item: Omit<Profession, 'id'> & { id?: string; updatedBy?: string }): Observable<Profession> {
    const newItem: Profession = { id: item.id ?? `prof_${Math.floor(Math.random() * 1000)}`, ...item } as Profession;
    this.professions.push(newItem);
    return of(newItem);
  }
  updateProfession(id: string, changes: Partial<Profession>): Observable<Profession | null> {
    const idx = this.professions.findIndex((p) => p.id === id);
    if (idx === -1) return of(null);
    this.professions[idx] = { ...this.professions[idx], ...changes };
    return of(this.professions[idx]);
  }
  deleteProfession(id: string): Observable<boolean> {
    const initial = this.professions.length;
    this.professions = this.professions.filter((p) => p.id !== id);
    return of(this.professions.length < initial);
  }

  // Spécialités
  getSpecialites(): Observable<Specialite[]> {
    return of([...this.specialites]);
  }
  createSpecialite(item: Omit<Specialite, 'id'> & { id?: string; updatedBy?: string }): Observable<Specialite> {
    const newItem: Specialite = { id: item.id ?? `spec_${Math.floor(Math.random() * 1000)}`, ...item } as Specialite;
    this.specialites.push(newItem);
    return of(newItem);
  }
  updateSpecialite(id: string, changes: Partial<Specialite>): Observable<Specialite | null> {
    const idx = this.specialites.findIndex((s) => s.id === id);
    if (idx === -1) return of(null);
    this.specialites[idx] = { ...this.specialites[idx], ...changes };
    return of(this.specialites[idx]);
  }
  deleteSpecialite(id: string): Observable<boolean> {
    const initial = this.specialites.length;
    this.specialites = this.specialites.filter((s) => s.id !== id);
    return of(this.specialites.length < initial);
  }

  // Personnels
  getPersonnels(): Observable<Personnel[]> {
    return of([...this.personnels]);
  }
  createPersonnel(item: Omit<Personnel, 'id'> & { id?: string; updatedBy?: string }): Observable<Personnel> {
    const base = (item.nom ?? 'NEW').substring(0, 3).toUpperCase();
    const newItem: Personnel = { id: item.id ?? `${base}${Math.floor(Math.random() * 1000)}`, ...item } as Personnel;
    this.personnels = [newItem, ...this.personnels];
    return of(newItem);
  }
  updatePersonnel(id: string, changes: Partial<Personnel>): Observable<Personnel | null> {
    const idx = this.personnels.findIndex((p) => p.id === id);
    if (idx === -1) return of(null);
    this.personnels[idx] = { ...this.personnels[idx], ...changes };
    return of(this.personnels[idx]);
  }
  deletePersonnel(id: string): Observable<boolean> {
    const initial = this.personnels.length;
    this.personnels = this.personnels.filter((p) => p.id !== id);
    return of(this.personnels.length < initial);
  }

  // Produits
  getProduits(): Observable<Produit[]> {
    return of([...this.produits]);
  }
  createProduit(item: Omit<Produit, 'id'> & { id?: string; updatedBy?: string }): Observable<Produit> {
    const newItem: Produit = { id: item.id ?? `PRD${Math.floor(Math.random() * 1000)}`, ...item } as Produit;
    this.produits = [newItem, ...this.produits];
    return of(newItem);
  }
  updateProduit(id: string, changes: Partial<Produit>): Observable<Produit | null> {
    const idx = this.produits.findIndex((p) => p.id === id);
    if (idx === -1) return of(null);
    this.produits[idx] = { ...this.produits[idx], ...changes };
    return of(this.produits[idx]);
  }
  deleteProduit(id: string): Observable<boolean> {
    const initial = this.produits.length;
    this.produits = this.produits.filter((p) => p.id !== id);
    return of(this.produits.length < initial);
  }
}
