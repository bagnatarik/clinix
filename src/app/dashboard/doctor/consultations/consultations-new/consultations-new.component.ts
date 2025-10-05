import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConsultationsService } from '../consultations.service';
import { Consultation } from '../../../../core/interfaces/medical';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-consultations-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './consultations-new.component.html',
  styleUrl: './consultations-new.component.css',
})
export class ConsultationsNewComponent {
  doctorName: string;
  form!: FormGroup;
  patients: string[] = ['Alice Dubois', 'Jean Dupont'];
  patientSearch: string = '';
  patientDropdownOpen = false;
  activeIndex: number = -1;
  showPatientDossier = false;
  // Modal Diagnostics
  diagnosticModalOpen = false;
  diagnosticForm!: FormGroup;
  severityOptions: string[] = ['léger', 'modéré', 'sévère'];
  diagnosticEditIndex: number | null = null;
  // Analyses médicales
  analysisModalOpen = false;
  analysisForm!: FormGroup;
  analysisOptions: string[] = ['NFS', 'CRP', 'Glycémie', 'Bilan hépatique', 'Ionogramme'];
  // Dropdown états pour le modal Analyses
  analysisTypeDropdownOpen = false;
  analysisTypeSearch: string = '';
  analysisTypeActiveIndex: number = -1;
  diagnosticSelectDropdownOpen = false;
  diagnosticSelectSearch: string = '';
  diagnosticSelectActiveIndex: number = -1;
  analysisEditIndex: number | null = null;
  // Prescriptions
  prescriptionModalOpen = false;
  prescriptionForm!: FormGroup;
  prescriptionEditIndex: number | null = null;
  prescriptionDiagnosticSelectDropdownOpen = false;
  prescriptionDiagnosticSelectSearch: string = '';
  prescriptionDiagnosticSelectActiveIndex: number = -1;
  // Hospitalisations
  hospitalisationModalOpen = false;
  hospitalisationForm!: FormGroup;
  hospitalisationEditIndex: number | null = null;
  hospitalisationDiagnosticSelectDropdownOpen = false;
  hospitalisationDiagnosticSelectSearch: string = '';
  hospitalisationDiagnosticSelectActiveIndex: number = -1;
  patientDossier: {
    code: string;
    createdAt: string;
    antecedents: { type: string; libelle: string; description?: string }[];
    analyses: { name: string; date: string; result?: string }[];
    hospitalisations: { motif: string; debut: string; fin?: string }[];
    prescriptions: { id: string; date: string; description: string }[];
    documents: { name: string }[];
  } = {
    code: 'DP-ALICE-001',
    createdAt: new Date().toISOString(),
    antecedents: [
      { type: 'Allergie', libelle: 'Pénicilline', description: 'Éruption cutanée en 2019' },
      { type: 'Chirurgie', libelle: 'Appendicectomie', description: '2017' },
    ],
    analyses: [
      { name: 'NFS', date: '2024-06-02', result: 'Normale' },
      { name: 'CRP', date: '2024-06-02', result: 'Élevée' },
    ],
    hospitalisations: [{ motif: 'Observation gastro', debut: '2024-06-03', fin: '2024-06-05' }],
    prescriptions: [{ id: 'PR-2024-145', date: '2024-06-05', description: 'Antalgiques + IPP' }],
    documents: [
      { name: 'Radiographie_abdomen_Alice_2024.jpg' },
      { name: 'Resultats_sanguins_Alice_2024.pdf' },
    ],
  };

  @ViewChild('patientTrigger') patientTrigger?: ElementRef;
  @ViewChild('patientMenu') patientMenu?: ElementRef;
  @ViewChild('patientSearchInput') patientSearchRef?: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private service: ConsultationsService,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.doctorName = this.auth.getCurrentUser()?.name ?? 'Dr. Anne Mercier';
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: [this.nowInputValue(), Validators.required],
      motif: ['', Validators.required],
      statut: ['planifiée', Validators.required],
      notesSoap: [''],
      typeConsultation: [''],
      description: [''],
      cout: [null],
      poids: [null],
      temperature: [null],
      tension: [''],
      diagnostics: this.fb.array([]),
      analyses: this.fb.array([]),
      prescriptions: this.fb.array([]),
      hospitalisations: this.fb.array([]),
    });

    // Formulaire du modal d'ajout diagnostic
    this.diagnosticForm = this.fb.group({
      maladie: ['', Validators.required],
      details: [''],
      gravite: [''],
    });

    // Formulaire du modal d'ajout d'analyse médicale
    this.analysisForm = this.fb.group({
      nomAnalyse: ['', Validators.required],
      dateAnalyse: ['', Validators.required],
      description: [''],
      typeAnalyse: [''],
      diagnosticRef: [''],
    });

    // Formulaire du modal d'ajout de prescription
    this.prescriptionForm = this.fb.group({
      date: ['', Validators.required],
      description: [''],
      motif: [''],
      diagnosticRef: [''],
    });

    // Formulaire du modal d'ajout d'hospitalisation
    this.hospitalisationForm = this.fb.group({
      dateAdmission: ['', Validators.required],
      dateSortie: [''],
      motif: [''],
      diagnosticRef: [''],
    });

    // Charger les patients depuis les consultations existantes pour obtenir une liste cohérente
    this.service.getAll().subscribe((list) => {
      const names = Array.from(new Set(list.map((c) => c.patient)));
      if (names.length) {
        this.patients = names;
      }
    });
    this.updatePatientDossier();
  }

  get diagnostics(): FormArray {
    return this.form.get('diagnostics') as FormArray;
  }

  get analyses(): FormArray {
    return this.form.get('analyses') as FormArray;
  }

  get prescriptions(): FormArray {
    return this.form.get('prescriptions') as FormArray;
  }

  get hospitalisations(): FormArray {
    return this.form.get('hospitalisations') as FormArray;
  }

  get hasDiagnostics(): boolean {
    return this.diagnostics.length > 0;
  }

  openDiagnosticModal(index?: number) {
    if (!this.form.get('patient')?.value) return;
    if (index !== undefined && index !== null) {
      const grp = this.diagnostics.at(index) as FormGroup;
      this.diagnosticForm.reset({
        maladie: grp.get('maladie')?.value || '',
        details: grp.get('details')?.value || '',
        gravite: grp.get('gravite')?.value || '',
      });
      this.diagnosticEditIndex = index;
    } else {
      this.diagnosticForm.reset({ maladie: '', details: '', gravite: '' });
      this.diagnosticEditIndex = null;
    }
    this.diagnosticModalOpen = true;
  }

  closeDiagnosticModal() {
    this.diagnosticModalOpen = false;
    this.diagnosticEditIndex = null;
  }

  capitalizeMaladie() {
    const ctrl = this.diagnosticForm.get('maladie');
    const v = (ctrl?.value as string) || '';
    if (!v) return;
    const cap = v.charAt(0).toUpperCase() + v.slice(1);
    if (cap !== v) ctrl?.setValue(cap);
  }

  saveDiagnosticFromModal() {
    if (this.diagnosticForm.invalid) return;
    const { maladie, details, gravite } = this.diagnosticForm.value as {
      maladie: string;
      details?: string;
      gravite?: string;
    };
    if (this.diagnosticEditIndex !== null) {
      const grp = this.diagnostics.at(this.diagnosticEditIndex) as FormGroup;
      grp.get('maladie')?.setValue(maladie);
      grp.get('details')?.setValue(details || '');
      grp.get('gravite')?.setValue(gravite || '');
    } else {
      this.diagnostics.push(
        this.fb.group({
          maladie: [maladie, Validators.required],
          details: [details || ''],
          gravite: [gravite || ''],
        })
      );
    }
    this.closeDiagnosticModal();
  }

  removeDiagnostic(index: number) {
    if (!this.form.get('patient')?.value) return;
    if (index < 0 || index >= this.diagnostics.length) return;
    this.diagnostics.removeAt(index);
  }

  editDiagnostic(index: number) {
    if (!this.form.get('patient')?.value) return;
    if (index < 0 || index >= this.diagnostics.length) return;
    this.openDiagnosticModal(index);
  }

  // Analyses médicales
  openAnalysisModal(index?: number) {
    if (!this.form.get('patient')?.value) return;
    if (!this.hasDiagnostics) return;
    if (index !== undefined && index !== null) {
      const grp = this.analyses.at(index) as FormGroup;
      this.analysisForm.reset({
        nomAnalyse: grp.get('nomAnalyse')?.value || '',
        dateAnalyse: grp.get('dateAnalyse')?.value || '',
        description: grp.get('description')?.value || '',
        typeAnalyse: grp.get('typeAnalyse')?.value || '',
        diagnosticRef: grp.get('diagnosticRef')?.value || '',
      });
      this.analysisEditIndex = index;
    } else {
      this.analysisForm.reset({ nomAnalyse: '', dateAnalyse: '', description: '', typeAnalyse: '', diagnosticRef: '' });
      this.analysisEditIndex = null;
    }
    this.analysisModalOpen = true;
  }

  closeAnalysisModal() {
    this.analysisModalOpen = false;
    this.analysisEditIndex = null;
  }

  saveAnalysisFromModal() {
    if (this.analysisForm.invalid) return;
    const { nomAnalyse, dateAnalyse, description, typeAnalyse, diagnosticRef } = this.analysisForm.value as {
      nomAnalyse: string;
      dateAnalyse: string;
      description?: string;
      typeAnalyse?: string;
      diagnosticRef?: string;
    };
    if (this.analysisEditIndex !== null) {
      const grp = this.analyses.at(this.analysisEditIndex) as FormGroup;
      grp.get('nomAnalyse')?.setValue(nomAnalyse);
      grp.get('dateAnalyse')?.setValue(dateAnalyse);
      grp.get('description')?.setValue(description || '');
      grp.get('typeAnalyse')?.setValue(typeAnalyse || '');
      grp.get('diagnosticRef')?.setValue(diagnosticRef || '');
    } else {
      this.analyses.push(
        this.fb.group({
          nomAnalyse: [nomAnalyse, Validators.required],
          dateAnalyse: [dateAnalyse, Validators.required],
          description: [description || ''],
          typeAnalyse: [typeAnalyse || ''],
          diagnosticRef: [diagnosticRef || ''],
        })
      );
    }
    this.closeAnalysisModal();
  }

  removeAnalysis(index: number) {
    if (!this.form.get('patient')?.value) return;
    if (index < 0 || index >= this.analyses.length) return;
    this.analyses.removeAt(index);
  }

  editAnalysis(index: number) {
    if (!this.form.get('patient')?.value) return;
    if (index < 0 || index >= this.analyses.length) return;
    this.openAnalysisModal(index);
  }

  // Dropdown helpers for Analyses type
  get filteredAnalysisOptions(): string[] {
    const q = this.analysisTypeSearch.trim().toLowerCase();
    if (!q) return this.analysisOptions;
    return this.analysisOptions.filter((a) => a.toLowerCase().includes(q));
  }

  toggleAnalysisTypeDropdown() {
    this.analysisTypeDropdownOpen = !this.analysisTypeDropdownOpen;
    if (this.analysisTypeDropdownOpen) {
      const list = this.filteredAnalysisOptions;
      const current = (this.analysisForm.get('typeAnalyse')?.value as string) || '';
      const idx = list.findIndex((x) => x === current);
      this.analysisTypeActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
    }
  }

  selectAnalysisType(opt: string) {
    this.analysisForm.get('typeAnalyse')?.setValue(opt, { emitEvent: true });
    this.analysisTypeDropdownOpen = false;
  }

  // Dropdown helpers for Diagnostics selection
  get diagnosticsLabels(): string[] {
    return this.diagnostics.controls.map((g) => (g.get('maladie')?.value as string) || '').filter(Boolean);
  }

  get filteredDiagnosticsOptions(): string[] {
    const q = this.diagnosticSelectSearch.trim().toLowerCase();
    const list = this.diagnosticsLabels;
    if (!q) return list;
    return list.filter((d) => d.toLowerCase().includes(q));
  }

  toggleDiagnosticSelectDropdown() {
    this.diagnosticSelectDropdownOpen = !this.diagnosticSelectDropdownOpen;
    if (this.diagnosticSelectDropdownOpen) {
      const list = this.filteredDiagnosticsOptions;
      const current = (this.analysisForm.get('diagnosticRef')?.value as string) || '';
      const idx = list.findIndex((x) => x === current);
      this.diagnosticSelectActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
    }
  }

  selectDiagnosticRef(label: string) {
    this.analysisForm.get('diagnosticRef')?.setValue(label, { emitEvent: true });
    this.diagnosticSelectDropdownOpen = false;
  }

  // Prescriptions
  openPrescriptionModal(index?: number) {
    if (!this.form.get('patient')?.value) return;
    if (!this.hasDiagnostics) return;
    if (index !== undefined && index !== null) {
      const grp = this.prescriptions.at(index) as FormGroup;
      this.prescriptionForm.reset({
        date: grp.get('date')?.value || '',
        description: grp.get('description')?.value || '',
        motif: grp.get('motif')?.value || '',
        diagnosticRef: grp.get('diagnosticRef')?.value || '',
      });
      this.prescriptionEditIndex = index;
    } else {
      this.prescriptionForm.reset({ date: '', description: '', motif: '', diagnosticRef: '' });
      this.prescriptionEditIndex = null;
    }
    this.prescriptionModalOpen = true;
  }

  closePrescriptionModal() {
    this.prescriptionModalOpen = false;
    this.prescriptionEditIndex = null;
  }

  savePrescriptionFromModal() {
    if (this.prescriptionForm.invalid) return;
    const { date, description, motif, diagnosticRef } = this.prescriptionForm.value as {
      date: string;
      description?: string;
      motif?: string;
      diagnosticRef?: string;
    };
    if (this.prescriptionEditIndex !== null) {
      const grp = this.prescriptions.at(this.prescriptionEditIndex) as FormGroup;
      grp.get('date')?.setValue(date);
      grp.get('description')?.setValue(description || '');
      grp.get('motif')?.setValue(motif || '');
      grp.get('diagnosticRef')?.setValue(diagnosticRef || '');
    } else {
      this.prescriptions.push(
        this.fb.group({
          date: [date, Validators.required],
          description: [description || ''],
          motif: [motif || ''],
          diagnosticRef: [diagnosticRef || ''],
        })
      );
    }
    this.closePrescriptionModal();
  }

  removePrescription(index: number) {
    if (!this.form.get('patient')?.value) return;
    if (index < 0 || index >= this.prescriptions.length) return;
    this.prescriptions.removeAt(index);
  }

  editPrescription(index: number) {
    if (!this.form.get('patient')?.value) return;
    if (index < 0 || index >= this.prescriptions.length) return;
    this.openPrescriptionModal(index);
  }

  get filteredDiagnosticsOptionsPrescription(): string[] {
    const q = this.prescriptionDiagnosticSelectSearch.trim().toLowerCase();
    const list = this.diagnosticsLabels;
    if (!q) return list;
    return list.filter((d) => d.toLowerCase().includes(q));
  }

  togglePrescriptionDiagnosticSelectDropdown() {
    this.prescriptionDiagnosticSelectDropdownOpen = !this.prescriptionDiagnosticSelectDropdownOpen;
    if (this.prescriptionDiagnosticSelectDropdownOpen) {
      const list = this.filteredDiagnosticsOptionsPrescription;
      const current = (this.prescriptionForm.get('diagnosticRef')?.value as string) || '';
      const idx = list.findIndex((x) => x === current);
      this.prescriptionDiagnosticSelectActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
    }
  }

  selectPrescriptionDiagnosticRef(label: string) {
    this.prescriptionForm.get('diagnosticRef')?.setValue(label, { emitEvent: true });
    this.prescriptionDiagnosticSelectDropdownOpen = false;
  }

  // Hospitalisations
  openHospitalisationModal(index?: number) {
    if (!this.form.get('patient')?.value) return;
    if (!this.hasDiagnostics) return;
    if (index !== undefined && index !== null) {
      const grp = this.hospitalisations.at(index) as FormGroup;
      this.hospitalisationForm.reset({
        dateAdmission: grp.get('dateAdmission')?.value || '',
        dateSortie: grp.get('dateSortie')?.value || '',
        motif: grp.get('motif')?.value || '',
        diagnosticRef: grp.get('diagnosticRef')?.value || '',
      });
      this.hospitalisationEditIndex = index;
    } else {
      this.hospitalisationForm.reset({ dateAdmission: '', dateSortie: '', motif: '', diagnosticRef: '' });
      this.hospitalisationEditIndex = null;
    }
    this.hospitalisationModalOpen = true;
  }

  closeHospitalisationModal() {
    this.hospitalisationModalOpen = false;
    this.hospitalisationEditIndex = null;
  }

  saveHospitalisationFromModal() {
    if (this.hospitalisationForm.invalid) return;
    const { dateAdmission, dateSortie, motif, diagnosticRef } = this.hospitalisationForm.value as {
      dateAdmission: string;
      dateSortie?: string;
      motif?: string;
      diagnosticRef?: string;
    };
    if (this.hospitalisationEditIndex !== null) {
      const grp = this.hospitalisations.at(this.hospitalisationEditIndex) as FormGroup;
      grp.get('dateAdmission')?.setValue(dateAdmission);
      grp.get('dateSortie')?.setValue(dateSortie || '');
      grp.get('motif')?.setValue(motif || '');
      grp.get('diagnosticRef')?.setValue(diagnosticRef || '');
    } else {
      this.hospitalisations.push(
        this.fb.group({
          dateAdmission: [dateAdmission, Validators.required],
          dateSortie: [dateSortie || ''],
          motif: [motif || ''],
          diagnosticRef: [diagnosticRef || ''],
        })
      );
    }
    this.closeHospitalisationModal();
  }

  removeHospitalisation(index: number) {
    if (!this.form.get('patient')?.value) return;
    if (index < 0 || index >= this.hospitalisations.length) return;
    this.hospitalisations.removeAt(index);
  }

  editHospitalisation(index: number) {
    if (!this.form.get('patient')?.value) return;
    if (index < 0 || index >= this.hospitalisations.length) return;
    this.openHospitalisationModal(index);
  }

  get filteredDiagnosticsOptionsHospitalisation(): string[] {
    const q = this.hospitalisationDiagnosticSelectSearch.trim().toLowerCase();
    const list = this.diagnosticsLabels;
    if (!q) return list;
    return list.filter((d) => d.toLowerCase().includes(q));
  }

  toggleHospitalisationDiagnosticSelectDropdown() {
    this.hospitalisationDiagnosticSelectDropdownOpen = !this.hospitalisationDiagnosticSelectDropdownOpen;
    if (this.hospitalisationDiagnosticSelectDropdownOpen) {
      const list = this.filteredDiagnosticsOptionsHospitalisation;
      const current = (this.hospitalisationForm.get('diagnosticRef')?.value as string) || '';
      const idx = list.findIndex((x) => x === current);
      this.hospitalisationDiagnosticSelectActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
    }
  }

  selectHospitalisationDiagnosticRef(label: string) {
    this.hospitalisationForm.get('diagnosticRef')?.setValue(label, { emitEvent: true });
    this.hospitalisationDiagnosticSelectDropdownOpen = false;
  }

  submit() {
    if (this.form.invalid) return;
    const {
      patient,
      date,
      motif,
      statut,
      typeConsultation,
      description,
      cout,
      poids,
      temperature,
      tension,
    } = this.form.value as Consultation;
    const diagnostics = (this.form.get('diagnostics') as FormArray).value;
    const analyses = (this.form.get('analyses') as FormArray).value;
    const prescriptions = (this.form.get('prescriptions') as FormArray).value;
    const hospitalisations = (this.form.get('hospitalisations') as FormArray).value;
    this.service
      .create({
        patient,
        date,
        motif,
        statut,
        typeConsultation,
        description,
        cout,
        poids,
        temperature,
        tension,
        diagnostics,
        analyses,
        prescriptions,
        hospitalisations,
      })
      .subscribe((created) =>
        this.router.navigate(['/dashboard/doctor/consultations', created.id])
      );
  }

  // Helpers
  get filteredPatients(): string[] {
    const q = this.patientSearch.trim().toLowerCase();
    if (!q) return this.patients;
    return this.patients.filter((p) => p.toLowerCase().includes(q));
  }

  private nowInputValue(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  }

  togglePatientDropdown() {
    this.patientDropdownOpen = !this.patientDropdownOpen;
    if (this.patientDropdownOpen) {
      // focus sur l'input de recherche dès l'ouverture
      setTimeout(() => {
        this.patientSearchRef?.nativeElement.focus();
      }, 0);
      // positionner l'élément actif au patient courant, sinon aucun par défaut
      const current = this.form.get('patient')?.value as string;
      const list = this.filteredPatients;
      const idx = list.findIndex((p) => p === current);
      this.activeIndex = idx >= 0 ? idx : -1;
    }
  }

  selectPatient(p: string) {
    this.form.get('patient')?.setValue(p);
    this.patientDropdownOpen = false;
    this.updatePatientDossier();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.patientDropdownOpen) return;
    const target = event.target as Node;
    if (this.patientTrigger?.nativeElement.contains(target)) return;
    if (this.patientMenu?.nativeElement.contains(target)) return;
    this.patientDropdownOpen = false;
  }

  // Gestion mousedown pour éviter les fermetures intempestives avant le click
  @HostListener('document:mousedown', ['$event'])
  onDocumentMouseDown(event: MouseEvent) {
    if (!this.patientDropdownOpen) return;
    const target = event.target as Node;
    if (this.patientTrigger?.nativeElement.contains(target)) return;
    if (this.patientMenu?.nativeElement.contains(target)) return;
    this.patientDropdownOpen = false;
  }

  // Navigation clavier façon shadcn combobox
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.patientDropdownOpen) return;
    const list = this.filteredPatients;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!list.length) return;
      this.activeIndex = this.activeIndex < list.length - 1 ? this.activeIndex + 1 : 0;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!list.length) return;
      this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : list.length - 1;
    } else if (event.key === 'Enter') {
      // Empêcher la soumission du formulaire quand le dropdown est ouvert
      event.preventDefault();
      if (this.activeIndex >= 0 && this.activeIndex < list.length) {
        this.selectPatient(list[this.activeIndex]);
      }
    } else if (event.key === 'Escape') {
      this.patientDropdownOpen = false;
    }
  }

  toggleDossier() {
    this.showPatientDossier = !this.showPatientDossier;
  }

  private updatePatientDossier() {
    const name: string = this.form.get('patient')?.value || '';
    const codeBase = name ? name.toUpperCase().replace(/\s+/g, '-') : 'PATIENT';
    this.patientDossier.code = `DP-${codeBase}-001`;
    // Exemple de léger ajustement des données pour varier selon le patient
    this.patientDossier.createdAt = new Date().toISOString();
    // Si aucun patient n'est sélectionné, ne pas charger de données fictives (évite l'impression
    // que le premier patient est sélectionné par défaut)
    if (!name) {
      this.patientDossier.antecedents = [];
      this.patientDossier.analyses = [];
      this.patientDossier.hospitalisations = [];
      this.patientDossier.prescriptions = [];
      this.patientDossier.documents = [];
      return;
    }
    if (name.toLowerCase().includes('jean')) {
      this.patientDossier.antecedents = [
        { type: 'Hypertension', libelle: 'HTA', description: 'Sous IEC depuis 2022' },
      ];
      this.patientDossier.analyses = [
        { name: 'Glycémie', date: '2024-05-12', result: 'Légèrement élevée' },
      ];
      this.patientDossier.hospitalisations = [];
      this.patientDossier.prescriptions = [
        { id: 'PR-2024-212', date: '2024-05-12', description: 'Antihypertenseur' },
      ];
      this.patientDossier.documents = [{ name: 'ECG_Jean_2024.pdf' }];
    } else {
      // Valeurs par défaut (Alice)
      // Autres patients: garder des données minimales ou vides
      this.patientDossier.antecedents = [];
      this.patientDossier.analyses = [];
      this.patientDossier.hospitalisations = [];
      this.patientDossier.prescriptions = [];
      this.patientDossier.documents = [];
    }
  }
}
