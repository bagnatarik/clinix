import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrdonnancesService } from '../ordonnances.service';
import { AuthenticationService } from '../../../../authentication/services/authentication-service';
import { ProduitsService } from '../../../produits/produits.service';
import { Produit } from '../../../../core/interfaces/admin';
import { PatientsService } from '../../../nurse/patients/patients.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-ordonnances-new',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './ordonnances-new.component.html',
})
export class OrdonnancesNewComponent implements OnInit {
  form!: FormGroup;
  doctorName: string = 'Médecin';
  // Dropdown patient façon Consultations
  patients: string[] = [];
  patientSearch: string = '';
  patientDropdownOpen = false;
  activeIndex: number = -1;

  // Options et états pour dropdown produit par ligne
  produitsOptions: Produit[] = [];
  productDropdownOpen = false;
  openProductIndex: number | null = null;
  productSearch: string = '';
  productActiveIndex: number = -1;

  constructor(
    private fb: FormBuilder,
    private service: OrdonnancesService,
    private router: Router,
    private auth: AuthenticationService,
    private produitsService: ProduitsService,
    private patientsService: PatientsService,
  ) {
    this.form = this.fb.group({
      patient: ['', Validators.required],
      date: ['', Validators.required],
      libelle: ['', Validators.required],
      coutTotal: [0, Validators.required],
      statut: ['brouillon', Validators.required],
      produits: this.fb.array([]),
    });
    this.doctorName = this.auth.getCurrentUser()?.name ?? 'Dr. Anne Mercier';

    // Date automatique (format YYYY-MM-DD pour input type="date")
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    this.form.get('date')?.setValue(`${yyyy}-${mm}-${dd}`);
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
    // Charger les patients depuis l’API et fallback statique en cas d’erreur
    this.patientsService
      .getAll()
      .pipe(
        catchError(() => {
          return of([
            { prenom: 'Alice', nom: 'Dubois' },
            { prenom: 'Jean', nom: 'Dupont' },
          ]);
        })
      )
      .subscribe((list: any[]) => {
        this.patients = (list || []).map((p) => `${p.prenom} ${p.nom}`.trim());
      });

    this.form.get('patient')?.valueChanges.subscribe((value) => {
      this.updatePatientDossier((value as string) || '');
      if (!value) {
        this.showPatientDossier = false;
      }
    });

    // Recalcule du coût total à chaque changement de produits
    this.produits.valueChanges.subscribe(() => {
      this.recalcTotal();
    });
    // Initialiser avec un produit vide pour guider l’utilisateur
    this.addProduct();

    // Charger les options de produits pour le dropdown
    this.produitsService.getAll().subscribe((list) => (this.produitsOptions = list));
  }

  toggleDossier(): void {
    const hasPatient = !!this.form.get('patient')?.value;
    if (!hasPatient) return;
    this.showPatientDossier = !this.showPatientDossier;
  }

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

  // Gestion signature/statut
  signerMaintenant = false;
  toggleSignature(checked: boolean) {
    this.signerMaintenant = checked;
    if (checked) {
      this.form.get('statut')?.setValue('signée');
    } else {
      // Ne pas écraser si utilisateur a choisi un autre statut que brouillon
      const current = (this.form.get('statut')?.value as string) || 'brouillon';
      if (current === 'signée') {
        this.form.get('statut')?.setValue('brouillon');
      }
    }
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

  // Gestion des produits dynamiques
  get produits(): FormArray {
    return this.form.get('produits') as FormArray;
  }

  private newProductGroup() {
    return this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      cout: [0, [Validators.min(0)]],
      prixProduit: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addProduct() {
    if (!this.form.get('patient')?.value) return;
    this.produits.push(this.newProductGroup());
    this.recalcTotal();
  }

  removeProduct(index: number) {
    if (index < 0 || index >= this.produits.length) return;
    this.produits.removeAt(index);
    this.recalcTotal();
  }

  recalcTotal() {
    const produits = this.produits.getRawValue() as Array<{ prixProduit?: number; cout?: number }>;
    const total = produits.reduce((sum, p) => sum + (Number(p.prixProduit) || Number(p.cout) || 0), 0);
    this.form.get('coutTotal')?.setValue(total);
  }

  // Dropdown produit helpers
  get filteredProduits(): Produit[] {
    const q = this.productSearch.trim().toLowerCase();
    if (!q) return this.produitsOptions;
    return this.produitsOptions.filter(
      (p) => p.nom.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }

  toggleProductDropdown(index: number): void {
    if (this.openProductIndex !== index || !this.productDropdownOpen) {
      this.openProductIndex = index;
      this.productDropdownOpen = true;
    } else {
      this.productDropdownOpen = false;
      this.openProductIndex = null;
    }
    if (this.productDropdownOpen) {
      const currentName = (this.produits.at(index).get('nom')?.value as string) || '';
      const list = this.filteredProduits;
      const idx = list.findIndex((p) => p.nom === currentName);
      this.productActiveIndex = idx >= 0 ? idx : list.length ? 0 : -1;
    }
  }

  selectProduit(index: number, p: Produit): void {
    const group = this.produits.at(index) as FormGroup;
    group.get('nom')?.setValue(p.nom);
    group.get('description')?.setValue(p.description || '');
    group.get('cout')?.setValue(p.cout || 0);
    group.get('prixProduit')?.setValue(p.cout || 0);
    this.productDropdownOpen = false;
    this.openProductIndex = null;
    this.recalcTotal();
  }

  submit() {
    if (this.form.invalid) return;
    const { patient, date, libelle, coutTotal, statut } = this.form.value;
    const produits = this.produits.getRawValue();
    const payload = { patient: patient!, date: date!, libelle: libelle!, coutTotal: coutTotal!, produits, statut: statut! };
    this.service
      .create(payload)
      .subscribe(() => this.router.navigate(['/dashboard/doctor/ordonnances/list']));
  }
}