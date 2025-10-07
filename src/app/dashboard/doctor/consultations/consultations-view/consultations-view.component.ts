import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConsultationsService } from '../consultations.service';
import { Consultation, ConsultationResponse } from '../../../../core/interfaces/medical';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consultations-view',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './consultations-view.component.html',
})
export class ConsultationsViewComponent {
  consultation$!: Observable<Consultation | null>;
  doctorName: string;

  // Préparation pour l'édition via formulaires
  // (les structures détaillées seront ajoutées dans une étape suivante)
  form!: FormGroup;
  diagnosticModalOpen = false;
  analysisModalOpen = false;
  prescriptionModalOpen = false;
  hospitalisationModalOpen = false;
  diagnosticForm!: FormGroup;
  analysisForm!: FormGroup;
  prescriptionForm!: FormGroup;
  hospitalisationForm!: FormGroup;
  severityOptions: string[] = ['léger', 'modéré', 'sévère'];
  analysisOptions: string[] = ['NFS', 'CRP', 'Glycémie', 'Bilan hépatique', 'Ionogramme'];
  diagnosticEditIndex: number | null = null;
  analysisEditIndex: number | null = null;
  prescriptionEditIndex: number | null = null;
  hospitalisationEditIndex: number | null = null;
  analysisTypeDropdownOpen = false;
  analysisTypeSearch = '';
  analysisTypeActiveIndex = -1;
  diagnosticSelectDropdownOpen = false;
  diagnosticSelectSearch = '';
  diagnosticSelectActiveIndex = -1;
  prescriptionDiagnosticSelectDropdownOpen = false;
  prescriptionDiagnosticSelectSearch = '';
  prescriptionDiagnosticSelectActiveIndex = -1;
  hospitalisationDiagnosticSelectDropdownOpen = false;
  hospitalisationDiagnosticSelectSearch = '';
  hospitalisationDiagnosticSelectActiveIndex = -1;

  constructor(
    private route: ActivatedRoute,
    private service: ConsultationsService,
    private auth: AuthenticationService,
    private fb: FormBuilder
  ) {
    this.doctorName = `Dr. ${this.auth.getCurrentUser()?.fullName || 'Anne Mercier'}`;

    // Init formulaires
    this.form = this.fb.group({
      patient: [{ value: '', disabled: true }],
      date: [''],
      motif: [''],
      statut: ['brouillon'],
      typeConsultation: [''],
      description: [''],
      cout: [null],
      poids: [null],
      temperature: [null],
      tension: [null],
      diagnostics: this.fb.array([]),
      analyses: this.fb.array([]),
      prescriptions: this.fb.array([]),
      hospitalisations: this.fb.array([]),
    });
    this.diagnosticForm = this.fb.group({
      maladie: ['', Validators.required],
      details: ['', Validators.required],
      gravite: ['', Validators.required],
    });
    this.analysisForm = this.fb.group({
      nomAnalyse: ['', Validators.required],
      typeAnalyse: ['', Validators.required],
      dateAnalyse: ['', Validators.required],
      description: ['', Validators.required],
      diagnosticRef: ['', Validators.required],
    });
    this.prescriptionForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      motif: ['', Validators.required],
      diagnosticRef: ['', Validators.required],
    });
    this.hospitalisationForm = this.fb.group({
      dateAdmission: ['', Validators.required],
      dateSortie: [''],
      motif: ['', Validators.required],
      diagnosticRef: ['', Validators.required],
    });

    // Charger la consultation selon l'identifiant de route (id ou publicId)
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');
      if (!id) {
        this.consultation$ = of(null);
        return;
      }
      this.service.getById(id).subscribe((c) => {
        if (c) {
          this.consultation$ = of(c);
          this.populateFromConsultation(c);
          this.ensureSeedForCONS001();
        } else {
          // Fallback V2: récupération via publicId et mapping vers Consultation
          this.service.getByPublicId(id).subscribe((resp) => {
            if (resp) {
              const mapped = this.mapResponseToConsultation(resp);
              this.consultation$ = of(mapped);
              this.populateFromConsultation(mapped);
            } else {
              this.consultation$ = of(null);
            }
          });
        }
      });
    });
  }

  // Helpers
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
  get diagnosticsLabels(): string[] {
    return this.diagnostics.controls.map((ctrl) => (ctrl as FormGroup).get('maladie')?.value || '');
  }

  populateFromConsultation(c: Consultation) {
    this.form.patchValue({
      patient: c.patient,
      date: c.date,
      motif: c.motif,
      statut: c.statut,
      typeConsultation: c.typeConsultation ?? '',
      description: c.description ?? '',
      cout: c.cout ?? null,
      poids: c.poids ?? null,
      temperature: c.temperature ?? null,
      tension: c.tension ?? '',
    });
    this.diagnostics.clear();
    (c.diagnostics || []).forEach((d) =>
      this.diagnostics.push(
        this.fb.group({ maladie: [d.maladie], details: [d.details], gravite: [d.gravite] })
      )
    );
    this.analyses.clear();
    (c.analyses || []).forEach((a) =>
      this.analyses.push(
        this.fb.group({
          nomAnalyse: [a.nomAnalyse],
          typeAnalyse: [a.typeAnalyse],
          dateAnalyse: [a.dateAnalyse],
          description: [a.description],
          diagnosticRef: [a.diagnosticRef],
        })
      )
    );
    this.prescriptions.clear();
    (c.prescriptions || []).forEach((p) =>
      this.prescriptions.push(
        this.fb.group({
          date: [p.date],
          description: [p.description],
          motif: [p.motif],
          diagnosticRef: [p.diagnosticRef],
        })
      )
    );
    this.hospitalisations.clear();
    (c.hospitalisations || []).forEach((h) =>
      this.hospitalisations.push(
        this.fb.group({
          dateAdmission: [h.dateAdmission],
          dateSortie: [h.dateSortie],
          motif: [h.motif],
          diagnosticRef: [h.diagnosticRef],
        })
      )
    );
  }

  private mapResponseToConsultation(resp: ConsultationResponse): Consultation {
    return {
      id: resp.publicId,
      patient: resp.codeDossierPatient, // Code dossier en attendant le nom du patient
      date: resp.consultationDate,
      motif: '',
      statut: (resp.consultationStatus as Consultation['statut']) || 'planifiée',
      typeConsultation: resp.consultationType,
      description: resp.consultationDescription,
      cout: resp.coutConsultation,
      poids: resp.poids,
      temperature: resp.temperature,
      tension: resp.tension,
      diagnostics: [],
      analyses: [],
      prescriptions: [],
      hospitalisations: [],
    };
  }

  signer() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    const raw = this.form.getRawValue();
    // Forcer le statut à "signée" avant mise à jour
    const payload: Partial<Consultation> = {
      patient: raw.patient,
      date: raw.date,
      motif: raw.motif,
      statut: 'signée',
      typeConsultation: raw.typeConsultation,
      description: raw.description,
      cout: raw.cout,
      poids: raw.poids,
      temperature: raw.temperature,
      tension: raw.tension,
      diagnostics: (this.form.get('diagnostics') as FormArray).value,
      analyses: (this.form.get('analyses') as FormArray).value,
      prescriptions: (this.form.get('prescriptions') as FormArray).value,
      hospitalisations: (this.form.get('hospitalisations') as FormArray).value,
    };
    this.service.update(id, payload).subscribe((updated) => {
      if (updated) {
        // Répercuter localement le statut signé
        this.form.get('statut')?.setValue('signée');
        this.consultation$ = of(updated);
      }
    });
  }

  updateConsultation() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    const raw = this.form.getRawValue();
    const diagnostics = (this.form.get('diagnostics') as FormArray).value;
    const analyses = (this.form.get('analyses') as FormArray).value;
    const prescriptions = (this.form.get('prescriptions') as FormArray).value;
    const hospitalisations = (this.form.get('hospitalisations') as FormArray).value;
    this.service
      .update(id, {
        patient: raw.patient,
        date: raw.date,
        motif: raw.motif,
        statut: raw.statut,
        typeConsultation: raw.typeConsultation,
        description: raw.description,
        cout: raw.cout,
        poids: raw.poids,
        temperature: raw.temperature,
        tension: raw.tension,
        diagnostics,
        analyses,
        prescriptions,
        hospitalisations,
      })
      .subscribe((updated) => {
        if (updated) {
          this.consultation$ = of(updated);
        }
      });
  }

  // Diagnostic
  openDiagnosticModal(index?: number) {
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
  saveDiagnosticFromModal() {
    if (this.diagnosticForm.invalid) return;
    const { maladie, details, gravite } = this.diagnosticForm.value as {
      maladie: string;
      details?: string;
      gravite?: string;
    };
    if (this.diagnosticEditIndex !== null) {
      const grp = this.diagnostics.at(this.diagnosticEditIndex) as FormGroup;
      grp.patchValue({ maladie, details: details || '', gravite: gravite || '' });
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
    const grp = this.diagnostics.at(index) as FormGroup;
    const label = (grp?.get('maladie')?.value as string) || '';
    this.diagnostics.removeAt(index);
    if (label) {
      for (let i = this.analyses.length - 1; i >= 0; i--) {
        const a = this.analyses.at(i) as FormGroup;
        if ((a.get('diagnosticRef')?.value as string) === label) {
          this.analyses.removeAt(i);
        }
      }
      for (let i = this.prescriptions.length - 1; i >= 0; i--) {
        const p = this.prescriptions.at(i) as FormGroup;
        if ((p.get('diagnosticRef')?.value as string) === label) {
          this.prescriptions.removeAt(i);
        }
      }
      for (let i = this.hospitalisations.length - 1; i >= 0; i--) {
        const h = this.hospitalisations.at(i) as FormGroup;
        if ((h.get('diagnosticRef')?.value as string) === label) {
          this.hospitalisations.removeAt(i);
        }
      }
    }
    this.updateConsultation();
  }

  // Analyse
  openAnalysisModal(index?: number) {
    if (!this.hasDiagnostics) return;
    if (index !== undefined && index !== null) {
      const grp = this.analyses.at(index) as FormGroup;
      this.analysisForm.reset({
        nomAnalyse: grp.get('nomAnalyse')?.value || '',
        typeAnalyse: grp.get('typeAnalyse')?.value || '',
        dateAnalyse: grp.get('dateAnalyse')?.value || '',
        description: grp.get('description')?.value || '',
        diagnosticRef: grp.get('diagnosticRef')?.value || '',
      });
      this.analysisEditIndex = index;
    } else {
      this.analysisForm.reset({
        nomAnalyse: '',
        typeAnalyse: '',
        dateAnalyse: '',
        description: '',
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
    const val = this.analysisForm.value as {
      nomAnalyse: string;
      typeAnalyse?: string;
      dateAnalyse: string;
      description?: string;
      diagnosticRef?: string;
    };
    if (this.analysisEditIndex !== null) {
      const grp = this.analyses.at(this.analysisEditIndex) as FormGroup;
      grp.patchValue({ ...val });
    } else {
      this.analyses.push(
        this.fb.group({
          nomAnalyse: [val.nomAnalyse, Validators.required],
          typeAnalyse: [val.typeAnalyse || ''],
          dateAnalyse: [val.dateAnalyse, Validators.required],
          description: [val.description || ''],
          diagnosticRef: [val.diagnosticRef || ''],
        })
      );
    }
    this.closeAnalysisModal();
  }
  removeAnalysis(index: number) {
    this.analyses.removeAt(index);
  }

  // Prescription
  openPrescriptionModal(index?: number) {
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
    const val = this.prescriptionForm.value as {
      date: string;
      description?: string;
      motif?: string;
      diagnosticRef?: string;
    };
    if (this.prescriptionEditIndex !== null) {
      const grp = this.prescriptions.at(this.prescriptionEditIndex) as FormGroup;
      grp.patchValue({ ...val });
    } else {
      this.prescriptions.push(
        this.fb.group({
          date: [val.date, Validators.required],
          description: [val.description || ''],
          motif: [val.motif || ''],
          diagnosticRef: [val.diagnosticRef || ''],
        })
      );
    }
    this.closePrescriptionModal();
  }
  removePrescription(index: number) {
    this.prescriptions.removeAt(index);
  }

  // Hospitalisation
  openHospitalisationModal(index?: number) {
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
    const val = this.hospitalisationForm.value as {
      dateAdmission: string;
      dateSortie?: string;
      motif?: string;
      diagnosticRef?: string;
    };
    if (this.hospitalisationEditIndex !== null) {
      const grp = this.hospitalisations.at(this.hospitalisationEditIndex) as FormGroup;
      grp.patchValue({ ...val });
    } else {
      this.hospitalisations.push(
        this.fb.group({
          dateAdmission: [val.dateAdmission, Validators.required],
          dateSortie: [val.dateSortie || ''],
          motif: [val.motif || ''],
          diagnosticRef: [val.diagnosticRef || ''],
        })
      );
    }
    this.closeHospitalisationModal();
  }
  removeHospitalisation(index: number) {
    this.hospitalisations.removeAt(index);
  }

  // --- Helpers style "consultations-new" ---
  capitalizeMaladie() {
    const ctrl = this.diagnosticForm.get('maladie');
    const v = (ctrl?.value as string) || '';
    if (!v) return;
    const cap = v.charAt(0).toUpperCase() + v.slice(1);
    if (cap !== v) ctrl?.setValue(cap);
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

  // Dropdown helpers for Diagnostics selection (Analyse)
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

  // Dropdown helpers for Diagnostics selection (Prescription)
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

  // Dropdown helpers for Diagnostics selection (Hospitalisation)
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

  // Seed automatique pour l'ID CONS-001 si listes vides
  private ensureSeedForCONS001(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'CONS-001') return;
    const today = new Date().toISOString().slice(0, 10);
    const hasAny =
      this.diagnostics.length > 0 ||
      this.analyses.length > 0 ||
      this.prescriptions.length > 0 ||
      this.hospitalisations.length > 0;
    if (!hasAny) {
      // Diagnostic de base
      const maladie = 'Hypertension';
      this.diagnostics.push(
        this.fb.group({
          maladie: [maladie, Validators.required],
          details: ['TA élevée, céphalées'],
          gravite: ['modéré'],
        })
      );
      // Analyse liée
      this.analyses.push(
        this.fb.group({
          nomAnalyse: ['NFS', Validators.required],
          typeAnalyse: ['Sanguin'],
          dateAnalyse: [today, Validators.required],
          description: ['Hémogramme complet'],
          diagnosticRef: [maladie],
        })
      );
      // Prescription liée
      this.prescriptions.push(
        this.fb.group({
          date: [today, Validators.required],
          description: ['Amlodipine 5mg/j'],
          motif: ['Traitement initial'],
          diagnosticRef: [maladie],
        })
      );
      // Hospitalisation liée
      this.hospitalisations.push(
        this.fb.group({
          dateAdmission: [today, Validators.required],
          dateSortie: [''],
          motif: ['Surveillance tensionnelle 24h'],
          diagnosticRef: [maladie],
        })
      );
      // Persistance immédiate
      this.updateConsultation();
    }
  }
}
