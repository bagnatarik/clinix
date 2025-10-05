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
      patient: ['Alice Dubois', Validators.required],
      date: [this.nowInputValue(), Validators.required],
      motif: ['', Validators.required],
      statut: ['planifiée', Validators.required],
      notesSoap: [''],
      diagnostics: this.fb.array([]),
    });

    // Charger les patients depuis les consultations existantes pour obtenir une liste cohérente
    this.service.getAll().subscribe((list) => {
      const names = Array.from(new Set(list.map((c) => c.patient)));
      if (names.length) {
        this.patients = names;
        // Si la valeur par défaut n’existe pas dans la liste, sélectionner le premier
        const current = this.form.get('patient')?.value;
        if (!this.patients.includes(current)) {
          this.form.get('patient')?.setValue(this.patients[0]);
        }
      }
    });
    this.updatePatientDossier();
  }

  get diagnostics(): FormArray {
    return this.form.get('diagnostics') as FormArray;
  }

  addDiagnostic(input?: HTMLInputElement) {
    const desc = (input?.value ?? '').trim();
    if (!desc) return;
    this.diagnostics.push(this.fb.group({ description: [desc, Validators.required] }));
    if (input) input.value = '';
  }

  removeDiagnostic(index: number) {
    if (index < 0 || index >= this.diagnostics.length) return;
    this.diagnostics.removeAt(index);
  }

  submit() {
    if (this.form.invalid) return;
    const { patient, date, motif, statut } = this.form.value as Consultation;
    this.service
      .create({ patient, date, motif, statut })
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
      // positionner l'élément actif au patient courant ou au premier de la liste
      const current = this.form.get('patient')?.value as string;
      const list = this.filteredPatients;
      const idx = list.findIndex((p) => p === current);
      this.activeIndex = idx >= 0 ? idx : list.length ? 0 : -1;
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
      this.patientDossier.antecedents = [
        { type: 'Allergie', libelle: 'Pénicilline', description: 'Éruption cutanée en 2019' },
        { type: 'Chirurgie', libelle: 'Appendicectomie', description: '2017' },
      ];
      this.patientDossier.analyses = [
        { name: 'NFS', date: '2024-06-02', result: 'Normale' },
        { name: 'CRP', date: '2024-06-02', result: 'Élevée' },
      ];
      this.patientDossier.hospitalisations = [
        { motif: 'Observation gastro', debut: '2024-06-03', fin: '2024-06-05' },
      ];
      this.patientDossier.prescriptions = [
        { id: 'PR-2024-145', date: '2024-06-05', description: 'Antalgiques + IPP' },
      ];
      this.patientDossier.documents = [
        { name: 'Radiographie_abdomen_Alice_2024.jpg' },
        { name: 'Resultats_sanguins_Alice_2024.pdf' },
      ];
    }
  }
}
