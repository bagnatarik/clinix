import { Component, HostListener, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConsultationsService } from '../consultations.service';
import { Consultation, PatientResponse } from '../../../../core/interfaces/medical';
import { Analyse } from '../../../../core/interfaces/admin';
import { AnalysesService } from '../../../admin/analyses/analyses.service';
import { AnalysesMedicalesService } from '../../consultations/analyses-medicales.service';
import { PrescriptionService } from '../../consultations/prescriptions.service';
import { HospitalisationService } from '../hospitalisation.service';
import { ChambresService } from '../../../chambres/chambres.service';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PatientService } from '../patient.service';
import { DossierPatientService } from '../dossier-patient.service';
import { AntecedentsService } from '../antecedents.service';
import { DiagnostiqueService } from '../diagnostique.service';
import { UsersService } from '../../../../core/services/users.service';
import { toast } from 'ngx-sonner';
import { PersonnelsService } from '../../../personnels/personnels.service';

@Component({
  selector: 'app-consultations-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './consultations-new.component.html',
  styleUrl: './consultations-new.component.css',
})
export class ConsultationsNewComponent implements OnInit {
  doctorName: string = '';
  form!: FormGroup;
  patientsNames: string[] = [];
  private patientsMap = new Map<string, PatientResponse>();
  patientSearch: string = '';
  patientDropdownOpen = false;
  activeIndex: number = -1;
  showPatientDossier = false;
  // Identifiant de consultation créé (si disponible)
  currentConsultationId?: string;
  // Modal Diagnostics
  diagnosticModalOpen = false;
  diagnosticForm!: FormGroup;
  severityOptions: string[] = ['léger', 'modéré', 'sévère'];
  diagnosticEditIndex: number | null = null;
  // Analyses médicales
  analysisModalOpen = false;
  analysisForm!: FormGroup;
  analysisOptions: string[] = [];
  analysisTypes: Analyse[] = [];
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
    private router: Router,
    private patientsService: PatientService,
    private dossierService: DossierPatientService,
    private antecedentsService: AntecedentsService,
    private analysesService: AnalysesService,
    private analysesMedicalesService: AnalysesMedicalesService,
    private prescriptionService: PrescriptionService,
    private diagnostiqueService: DiagnostiqueService,
    private usersService: UsersService,
    private personnnelService: PersonnelsService,
    private hospitalisationService: HospitalisationService,
    private chambresService: ChambresService
  ) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: [this.nowInputValue(), Validators.required],
      motif: ['', Validators.required],
      statut: ['signée', Validators.required],
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

    // Charger la liste des patients via le service Patient pour le select
    this.patientsService.getAll().subscribe((list) => {
      const names = Array.from(new Set(list.map((p) => `${p.nom} ${p.prenom}`)));
      this.patientsNames = names;
      this.patientsMap.clear();
      list.forEach((p) => this.patientsMap.set(`${p.nom} ${p.prenom}`, p));
    });

    // Récupérer l'identifiant du personnel connecté (publicId) pour les requêtes V2
    const currentEmail = this.auth.getCurrentUser()?.email || '';
    this.usersService.getAll().subscribe((users) => {
      const me = users.find((u) => u.username === currentEmail);
      this.currentPersonnelPublicId = me?.personnel?.publicId || null;
    });

    // Charger les types d'analyses depuis le service Admin
    this.analysesService.getAll().subscribe((types) => {
      this.analysisTypes = types || [];
      this.analysisOptions = this.analysisTypes.map((t) => t.libelle);
    });
    this.updatePatientDossier();
  }

  // Identifiant du personnel connecté (UUID publicId)
  private currentPersonnelPublicId: string | null = null;

  ngOnInit() {
    this.doctorName = `Dr. ${this.auth.getCurrentUser()?.fullName || 'Anne Mercier'}`;
    // Met à jour automatiquement le dossier à la modification du patient
    this.form.get('patient')?.valueChanges.subscribe(() => this.updatePatientDossier());
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
      const publicId = (grp.get('diagnostiquePublicId')?.value as string) || '';
      if (publicId) {
        // Mettre à jour côté backend si un diagnostique existe déjà
        const payload = {
          maladie: maladie,
          details: details || '',
          niveauGravite: gravite || '',
          idConsultation: this.currentConsultationId || '',
        };
        this.diagnostiqueService.update(publicId, payload).subscribe();
      }
    } else {
      const grp = this.fb.group({
        maladie: [maladie, Validators.required],
        details: [details || ''],
        gravite: [gravite || ''],
        diagnostiquePublicId: [''],
      });
      this.diagnostics.push(grp);
      // Persister le diagnostique immédiatement.
      // Si la consultation n'existe pas encore, créer une consultation brouillon
      // puis persister le diagnostique avec l'identifiant obtenu.
      const ensureConsultationAndCreate = (consultId: string) => {
        const payload = {
          maladie: maladie,
          details: details || '',
          niveauGravite: gravite || '',
          idConsultation: consultId,
        };
        this.diagnostiqueService.create(payload).subscribe((resp: any) => {
          grp.get('diagnostiquePublicId')?.setValue(resp?.publicId || '');
        });
      };

      if (this.currentConsultationId) {
        ensureConsultationAndCreate(this.currentConsultationId);
      } else {
        const raw = this.form.getRawValue() as Consultation;
        const selectedPatient = this.patientsMap.get(raw.patient || '');
        const idDossierPatient = selectedPatient?.dossierPublicId || '';
        const currentUserPublicId = this.auth.getCurrentUser()?.id || '';

        if (!currentUserPublicId || !idDossierPatient) {
          toast.error(
            'Impossible de créer la consultation: utilisateur courant ou dossier patient manquant'
          );
          this.closeDiagnosticModal();
          return;
        }

        this.personnnelService.getAll().subscribe((personnels) => {
          const idPersonnel =
            personnels?.find((u) => u.idUser === currentUserPublicId)?.publicId || '';

          if (!idPersonnel) {
            toast.error('Impossible de créer la consultation: aucun personnel associé au compte');
            this.closeDiagnosticModal();
            return;
          }

          const payload = {
            consultationType: raw.typeConsultation || '',
            consultationDescription: raw.description || '',
            consultationStatus: raw.statut || 'planifiée',
            coutConsultation: Number(raw.cout) || 0,
            poids: Number(raw.poids) || 0,
            temperature: Number(raw.temperature) || 0,
            tension: Number(raw.tension) || 0,
            idPersonnel,
            idDossierPatient,
          };
          this.service.createV2(payload).subscribe((created) => {
            this.currentConsultationId = created.publicId;
            ensureConsultationAndCreate(created.publicId);
          });
        });
      }
    }
    this.closeDiagnosticModal();
  }

  removeDiagnostic(index: number) {
    if (!this.form.get('patient')?.value) return;
    if (index < 0 || index >= this.diagnostics.length) return;
    const grp = this.diagnostics.at(index) as FormGroup;
    const publicId = (grp.get('diagnostiquePublicId')?.value as string) || '';
    if (publicId) {
      this.diagnostiqueService.deleteByPublicId(publicId).subscribe();
    }
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
      this.analysisForm.reset({
        nomAnalyse: '',
        dateAnalyse: '',
        description: '',
        typeAnalyse: '',
        diagnosticRef: '',
      });
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
    const { nomAnalyse, dateAnalyse, description, typeAnalyse, diagnosticRef } = this.analysisForm
      .value as {
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
      // Sauvegarde immédiate côté backend
      const diagLabel = diagnosticRef || '';
      const diagIdx = this.diagnostics.controls.findIndex(
        (g) => (g.get('maladie')?.value as string) === diagLabel
      );
      const diagGrp = diagIdx >= 0 ? (this.diagnostics.at(diagIdx) as FormGroup) : null;
      const diagnostiquePublicId = (diagGrp?.get('diagnostiquePublicId')?.value as string) || '';
      if (!diagnostiquePublicId) {
        toast.error('Aucun diagnostique sélectionné ou non persisté');
      } else {
        // Trouver l’ID de type d’analyse (idAnalyse) via le libellé sélectionné
        const type = (typeAnalyse || '').trim();
        const anaType = this.analysisTypes.find((t) => t.libelle === type);
        const idAnalyse = (anaType as any)?.publicId || '';
        if (!idAnalyse) {
          toast.error("Type d'analyse introuvable");
        } else {
          this.analysesMedicalesService
            .create({
              nomAnalyseMedicale: nomAnalyse,
              dateAnalyseMedicale: dateAnalyse,
              description: description || '',
              idAnalyse,
              idDiagnostique: diagnostiquePublicId,
            })
            .subscribe();
        }
      }
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
    return this.diagnostics.controls
      .map((g) => (g.get('maladie')?.value as string) || '')
      .filter(Boolean);
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

      // Sauvegarde immédiate côté backend (V2)
      const diagLabel = diagnosticRef || '';
      const diagIdx = this.diagnostics.controls.findIndex(
        (g) => (g.get('maladie')?.value as string) === diagLabel
      );
      const diagGrp = diagIdx >= 0 ? (this.diagnostics.at(diagIdx) as FormGroup) : null;
      const diagnostiquePublicId = (diagGrp?.get('diagnostiquePublicId')?.value as string) || '';
      if (!diagnostiquePublicId) {
        toast.error('Aucun diagnostique sélectionné ou non persisté');
      } else {
        this.prescriptionService
          .create({
            motif: motif || '',
            description: description || '',
            idDiagnostique: diagnostiquePublicId,
          })
          .subscribe();
      }
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
      this.hospitalisationForm.reset({
        dateAdmission: '',
        dateSortie: '',
        motif: '',
        diagnosticRef: '',
      });
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
      // Sauvegarde immédiate côté backend
      const diagLabel = diagnosticRef || '';
      const diagIdx = this.diagnostics.controls.findIndex(
        (g) => (g.get('maladie')?.value as string) === diagLabel
      );
      const diagGrp = diagIdx >= 0 ? (this.diagnostics.at(diagIdx) as FormGroup) : null;
      const diagnostiquePublicId = (diagGrp?.get('diagnostiquePublicId')?.value as string) || '';
      if (!diagnostiquePublicId) {
        toast.error('Aucun diagnostique sélectionné ou non persisté');
      } else {
        this.chambresService.getAll().subscribe({
          next: (rooms) => {
            const idChambre = (rooms && rooms[0]?.publicId) || '';
            if (!idChambre) {
              toast.error("Aucune chambre disponible pour l'hospitalisation");
            } else {
              this.hospitalisationService
                .create({
                  motif: motif || '',
                  idDiagnostique: diagnostiquePublicId,
                  idChambre,
                  ...(dateSortie ? { dateSortie } : {}),
                })
                .subscribe();
            }
          },
          error: () => toast.error('Erreur lors du chargement des chambres'),
        });
      }
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
    this.hospitalisationDiagnosticSelectDropdownOpen =
      !this.hospitalisationDiagnosticSelectDropdownOpen;
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
    if (this.form.invalid) {
      toast.error('Formulaire incomplet: veuillez remplir les champs requis');
      return;
    }
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
    const diagnosticsCount = (this.form.get('diagnostics') as FormArray).length;
    const analyses = (this.form.get('analyses') as FormArray).value;
    const prescriptions = (this.form.get('prescriptions') as FormArray).value;
    const hospitalisations = (this.form.get('hospitalisations') as FormArray).value;
    const selectedPatient = this.patientsMap.get(patient || '');
    const idDossierPatient = selectedPatient?.dossierPublicId || '';
    const currentUserPublicId = this.auth.getCurrentUser()?.id || '';
    // Si aucun diagnostic, toujours créer une nouvelle consultation (pas d'update)
    if (diagnosticsCount === 0) {
      if (!currentUserPublicId || !idDossierPatient) {
        toast.error('Veuillez sélectionner un patient et vérifier votre compte personnel');
        return;
      }
      this.personnnelService.getAll().subscribe((personnels) => {
        const idPersonnel =
          personnels?.find((u) => u.idUser === currentUserPublicId)?.publicId || '';
        if (!idPersonnel) {
          toast.error('Impossible de créer la consultation: aucun personnel associé au compte');
          return;
        }
        const payload = {
          consultationType: typeConsultation || '',
          consultationDescription: description || '',
          consultationStatus: statut || 'planifiée',
          coutConsultation: Number(cout) || 0,
          poids: Number(poids) || 0,
          temperature: Number(temperature) || 0,
          tension: Number(tension) || 0,
          idPersonnel,
          idDossierPatient,
        };
        this.service.createV2(payload).subscribe((created) => {
          this.currentConsultationId = created.publicId;
          this.router.navigate(['/dashboard/doctor/consultations', created.publicId]);
        });
      });
      return;
    }

    // S'il y a des diagnostics, mettre à jour si une consultation existe, sinon créer
    const ensurePersonnelId = (cb: (idPersonnel: string) => void) => {
      const cached = this.currentPersonnelPublicId || '';
      if (cached) return cb(cached);
      const userId = this.auth.getCurrentUser()?.id || '';
      if (!userId) {
        toast.error('Compte personnel introuvable');
        return;
      }
      this.personnnelService.getAll().subscribe((personnels) => {
        const resolved = personnels?.find((u) => u.idUser === userId)?.publicId || '';
        if (!resolved) {
          toast.error('Impossible de finaliser la consultation: aucun personnel associé au compte');
          return;
        }
        this.currentPersonnelPublicId = resolved;
        cb(resolved);
      });
    };

    ensurePersonnelId((idPersonnel) => {
      const payload = {
        consultationType: typeConsultation || '',
        consultationDescription: description || '',
        consultationStatus: statut || 'planifiée',
        coutConsultation: Number(cout) || 0,
        poids: Number(poids) || 0,
        temperature: Number(temperature) || 0,
        tension: Number(tension) || 0,
        idPersonnel,
        idDossierPatient,
      };
      if (!idDossierPatient) {
        toast.error('Veuillez sélectionner un patient et vérifier votre compte personnel');
        return;
      }
      if (this.currentConsultationId) {
        this.service.updateV2(this.currentConsultationId, payload).subscribe(() => {
          this.router.navigate(['/dashboard/doctor/consultations', this.currentConsultationId!]);
        });
      } else {
        this.service.createV2(payload).subscribe((created) => {
          this.currentConsultationId = created.publicId;
          this.router.navigate(['/dashboard/doctor/consultations', created.publicId]);
        });
      }
    });
  }

  // Helpers
  get filteredPatients(): string[] {
    const q = this.patientSearch.trim().toLowerCase();
    if (!q) return this.patientsNames;
    return this.patientsNames.filter((p) => p.toLowerCase().includes(q));
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
    if (!name) {
      this.patientDossier.code = '';
      this.patientDossier.createdAt = '';
      this.patientDossier.antecedents = [];
      this.patientDossier.analyses = [];
      this.patientDossier.hospitalisations = [];
      this.patientDossier.prescriptions = [];
      this.patientDossier.documents = [];
      return;
    }
    const selected = this.patientsMap.get(name);
    if (!selected) {
      this.patientDossier.code = '';
      this.patientDossier.createdAt = '';
      this.patientDossier.antecedents = [];
      this.patientDossier.analyses = [];
      this.patientDossier.hospitalisations = [];
      this.patientDossier.prescriptions = [];
      this.patientDossier.documents = [];
      return;
    }
    this.dossierService.getByPublicId(selected.dossierPublicId).subscribe((dossier) => {
      if (!dossier) return;
      // Infos de base du dossier
      this.patientDossier.code = dossier.code;
      this.patientDossier.createdAt = dossier.dateCreation;

      // Antécédents du dossier via service dédié (filtrés par code dossier)
      this.antecedentsService.getAll().subscribe((list) => {
        const data = list || [];
        this.patientDossier.antecedents = data
          .filter((a) => a.codeDossierPatient === dossier.code)
          .map((a) => ({
            type: a.libelleTypeAntecedant,
            libelle: a.libelleTypeAntecedant,
            description: a.description,
          }));
      });

      // Agrégations depuis les consultations pour analyses, prescriptions et hospitalisations
      this.service.getAll().subscribe((rows) => {
        const mine = (rows || []).filter((c) => c.patient === name);

        // Analyses
        const analyses: { name: string; date: string; result?: string }[] = [];
        mine.forEach((c) => {
          (c.analyses || []).forEach((an) => {
            analyses.push({
              name: an.nomAnalyse,
              date: an.dateAnalyse,
              result: an.description || '',
            });
          });
        });
        this.patientDossier.analyses = analyses;

        // Hospitalisations
        const hospitalisations: { motif: string; debut: string; fin?: string }[] = [];
        mine.forEach((c) => {
          (c.hospitalisations || []).forEach((h) => {
            hospitalisations.push({
              motif: h.motif || '',
              debut: h.dateAdmission,
              fin: h.dateSortie,
            });
          });
        });
        this.patientDossier.hospitalisations = hospitalisations;

        // Prescriptions
        const prescriptions: { id: string; date: string; description: string }[] = [];
        mine.forEach((c) => {
          let idx = 0;
          (c.prescriptions || []).forEach((p) => {
            prescriptions.push({
              id: `CONS-${c.id}-PR-${++idx}`,
              date: p.date,
              description: p.description || p.motif || '',
            });
          });
        });
        this.patientDossier.prescriptions = prescriptions;

        // Documents (non fournis pour l’instant)
        this.patientDossier.documents = [];
      });
    });
  }
}
