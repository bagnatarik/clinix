import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PrescriptionsService } from '../prescriptions.service';
import { Prescription } from '../../../../core/interfaces/medical';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';

@Component({
  selector: 'app-prescriptions-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './prescriptions-new.component.html',
  styleUrl: './prescriptions-new.component.css',
})
export class PrescriptionsNewComponent implements OnInit {
  form!: FormGroup;
  doctorName: string = 'Médecin';
  // Autocomplete patient
  selectedPatient: { nom: string; prenom: string } | null = null;
  patientsSuggestions: { nom: string; prenom: string }[] = [];
  private patients: { nom: string; prenom: string }[] = [
    { nom: 'Dubois', prenom: 'Alice' },
    { nom: 'Dupont', prenom: 'Jean' },
    { nom: 'Martin', prenom: 'Sophie' },
    { nom: 'Bernard', prenom: 'Paul' },
  ];
  // Dropdown patient façon Consultations
  patientsNames: string[] = [];
  patientSearch: string = '';
  patientDropdownOpen = false;
  activeIndex: number = -1;

  constructor(
    private fb: FormBuilder,
    private service: PrescriptionsService,
    private router: Router,
    private auth: AuthenticationService
  ) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: ['', Validators.required],
      details: ['', Validators.required],
      statut: ['brouillon', Validators.required],
    });
    this.doctorName = this.auth.getCurrentUser()?.name ?? 'Dr. Anne Mercier';
    this.patientsNames = Array.from(new Set(this.patients.map((p) => `${p.nom} ${p.prenom}`)));
  }

  // Affichage du dossier patient
  showPatientDossier = false;
  patientDossier: {
    antecedents: string[];
    analyses: { name: string; date: string }[];
    hospitalisations: { motif: string; debut: string; fin?: string }[];
    prescriptions: { id: string; date: string; description: string }[];
    documents: { name: string }[];
  } = {
    antecedents: [],
    analyses: [],
    hospitalisations: [],
    prescriptions: [],
    documents: [],
  };

  ngOnInit(): void {
    this.form.get('patient')?.valueChanges.subscribe((value) => {
      this.updatePatientDossier((value as string) || '');
    });
  }

  // Autocomplete handlers
  onPatientSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const q = (input.value || '').toLowerCase();
    // Update reactive form control value
    this.form.get('patient')?.setValue(input.value, { emitEvent: true });
    // Reset selected patient if the text changes
    this.selectedPatient = null;
    // Compute suggestions
    this.patientsSuggestions = this.patients.filter((p) =>
      `${p.nom} ${p.prenom}`.toLowerCase().includes(q)
    );
  }

  selectPatient(p: { nom: string; prenom: string }): void {
    this.selectedPatient = p;
    const fullName = `${p.nom} ${p.prenom}`;
    this.form.get('patient')?.setValue(fullName, { emitEvent: true });
    this.patientsSuggestions = [];
    this.updatePatientDossier(fullName);
  }

  toggleDossier(): void { this.showPatientDossier = !this.showPatientDossier; }

  // Dropdown Consultations-like
  get filteredPatients(): string[] {
    const q = this.patientSearch.trim().toLowerCase();
    if (!q) return this.patientsNames;
    return this.patientsNames.filter((p) => p.toLowerCase().includes(q));
  }

  togglePatientDropdown() {
    this.patientDropdownOpen = !this.patientDropdownOpen;
    if (this.patientDropdownOpen) {
      const list = this.filteredPatients;
      const current = (this.form.get('patient')?.value as string) || '';
      const idx = list.findIndex((p) => p === current);
      this.activeIndex = idx >= 0 ? idx : list.length ? 0 : -1;
    }
  }

  selectPatientName(name: string) {
    this.form.get('patient')?.setValue(name, { emitEvent: true });
    this.patientDropdownOpen = false;
    this.updatePatientDossier(name);
  }

  private updatePatientDossier(patientName: string): void {
    if (!patientName) {
      this.patientDossier = {
        antecedents: [],
        analyses: [],
        hospitalisations: [],
        prescriptions: [],
        documents: [],
      };
      return;
    }

    if (patientName.toLowerCase().includes('alice')) {
      this.patientDossier = {
        antecedents: ['Hypertension', 'Allergie pénicilline'],
        analyses: [
          { name: 'NFS', date: '2024-06-02' },
          { name: 'CRP', date: '2024-06-02' },
        ],
        hospitalisations: [
          { motif: 'Observation gastro', debut: '2024-06-03', fin: '2024-06-05' },
        ],
        prescriptions: [
          { id: 'PR-2024-145', date: '2024-06-05', description: 'Antalgiques + IPP' },
        ],
        documents: [
          { name: 'Radiographie_abdomen_Alice_2024.jpg' },
          { name: 'Resultats_sanguins_Alice_2024.pdf' },
        ],
      };
    } else {
      this.patientDossier = {
        antecedents: ['Aucun antécédent connu'],
        analyses: [{ name: 'Glycémie à jeun', date: '2024-02-18' }],
        hospitalisations: [],
        prescriptions: [],
        documents: [],
      };
    }
  }

  submit() {
    if (this.form.invalid) return;
    const { patient, date, details, statut } = this.form.value;
    this.service
      .create({ patient: patient!, date: date!, details: details!, statut: statut! as any })
      .subscribe((created) => this.router.navigate(['/dashboard/doctor/prescriptions', created.id]));
  }
}