import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DiagnosticsService } from '../diagnostics.service';
import { Diagnostic } from '../../../../core/interfaces/medical';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';

@Component({
  selector: 'app-diagnostics-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './diagnostics-new.component.html',
  styleUrl: './diagnostics-new.component.css',
})
export class DiagnosticsNewComponent implements OnInit {
  form!: FormGroup;
  doctorName: string = 'Médecin';
  // Dropdown patient façon Consultations
  patients: string[] = ['Alice Dubois', 'Jean Dupont'];
  patientSearch: string = '';
  patientDropdownOpen = false;
  activeIndex: number = -1;

  constructor(
    private fb: FormBuilder,
    private service: DiagnosticsService,
    private router: Router,
    private auth: AuthenticationService
  ) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: ['', Validators.required],
      resultat: ['', Validators.required],
      statut: ['en attente', Validators.required],
    });
    this.doctorName = this.auth.getCurrentUser()?.name ?? 'Dr. Anne Mercier';
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

  toggleDossier(): void { this.showPatientDossier = !this.showPatientDossier; }

  // Dropdown Consultations-like
  get filteredPatients(): string[] {
    const q = this.patientSearch.trim().toLowerCase();
    if (!q) return this.patients;
    return this.patients.filter((p) => p.toLowerCase().includes(q));
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
    const { patient, date, resultat, statut } = this.form.value;
    this.service
      .create({ patient: patient!, date: date!, resultat: resultat!, statut: statut! as any })
      .subscribe(() => this.router.navigate(['/dashboard/doctor/diagnostics/list']));
  }
}