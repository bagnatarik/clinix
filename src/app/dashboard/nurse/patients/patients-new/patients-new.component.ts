import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PatientsService } from '../patients.service';
import { toast } from 'ngx-sonner';
import { AntecedentsService } from '../../../doctor/consultations/antecedents.service';
import { TypesAntecedantService } from '../../../types-antecedant/types-antecedant.service';
import { TypeAntecedant } from '../../../../core/interfaces/admin';
import { DossierPatientService } from '../../../doctor/consultations/dossier-patient.service';
import { of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-patients-new-nurse',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-white border border-neutral-300 rounded p-6">
        <h2 class="text-xl font-bold text-gray-800">Nouveau patient</h2>
        <p class="text-xs text-gray-600 mt-1">Renseignez les informations du patient.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6 mt-4">
          <h3 class="text-sm font-semibold text-gray-700">Informations personnelles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Nom</label>
              <input
                type="text"
                class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                formControlName="nom"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Prénom</label>
              <input
                type="text"
                class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                formControlName="prenom"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Sexe</label>
              <select
                class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                formControlName="sexe"
              >
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Feminin</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Date de naissance</label>
              <input
                type="date"
                class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                formControlName="dateNaissance"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
              <input
                type="text"
                class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                formControlName="telephone"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <input
                type="email"
                class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                formControlName="email"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">Mot de passe</label>
              <div class="flex gap-2">
                <input
                  type="password"
                  readonly
                  class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                  formControlName="motDePasse"
                />
                <button
                  type="button"
                  (click)="regeneratePassword()"
                  class="px-3 py-2 border border-neutral-300 text-gray-700 rounded text-sm hover:bg-neutral-50"
                >
                  Régénérer
                </button>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">Adresse</label>
              <input
                type="text"
                class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                formControlName="adresse"
              />
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-gray-700">Antécédents</h3>
            <div class="space-y-4" formArrayName="antecedents">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
                *ngFor="let group of antecedents.controls; let i = index"
                [formGroupName]="i"
              >
                <div class="relative">
                  <label class="block text-xs font-medium text-gray-500 mb-1"
                    >Type d'antécédent</label
                  >
                  <button
                    type="button"
                    class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 text-left text-sm flex items-center justify-between hover:bg-neutral-50"
                    (click)="toggleTypeDropdown(i)"
                    [attr.aria-expanded]="typeDropdownOpenIndex === i"
                  >
                    <span>{{ group.get('type')?.value || 'Sélectionner un type' }}</span>
                    <svg
                      class="size-4 text-neutral-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  <div
                    *ngIf="typeDropdownOpenIndex === i"
                    class="absolute left-0 top-full mt-2 w-full bg-white border border-neutral-300 rounded shadow-sm p-2 z-50"
                    (click)="$event.stopPropagation()"
                    (mousedown)="$event.stopPropagation()"
                  >
                    <input
                      type="text"
                      [(ngModel)]="typeSearch"
                      [ngModelOptions]="{ standalone: true }"
                      placeholder="Rechercher un type..."
                      class="w-full border border-neutral-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none"
                      (click)="$event.stopPropagation()"
                      (mousedown)="$event.stopPropagation()"
                      (keydown.enter)="$event.preventDefault()"
                    />

                    <div class="max-h-44 overflow-y-auto">
                      <button
                        type="button"
                        class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded"
                        *ngFor="let opt of filteredTypeOptions; let ti = index"
                        (mouseenter)="typeActiveIndex = ti"
                        [class.bg-blue-50]="
                          typeActiveIndex === ti || group.get('type')?.value === opt.label
                        "
                        (click)="selectType(i, opt)"
                      >
                        {{ opt.label }}
                      </button>

                      <div
                        *ngIf="filteredTypeOptions.length === 0"
                        class="px-3 py-2 text-xs text-neutral-500"
                      >
                        Aucun type trouvé
                      </div>
                    </div>
                  </div>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea
                    rows="3"
                    class="w-full border border-neutral-300 rounded px-3 py-2 text-gray-800 focus:outline-none text-sm"
                    formControlName="description"
                  ></textarea>
                </div>
                <div class="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    (click)="removeAntecedent(i)"
                    class="px-3 py-2 text-sm border border-neutral-300 rounded hover:bg-neutral-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              (click)="addAntecedent()"
              class="px-4 py-2 text-sm border border-neutral-300 rounded hover:bg-neutral-50"
            >
              Ajouter un antécédent
            </button>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              class="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="form.invalid"
            >
              Enregistrer
            </button>
            <a
              class="px-5 py-2.5 border border-neutral-300 text-gray-700 rounded hover:bg-neutral-50 transition text-sm"
              [routerLink]="['/dashboard/infirmier/patients/list']"
            >
              Annuler
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class PatientsNewNurseComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: PatientsService,
    private antecedentService: AntecedentsService,
    private dossierService: DossierPatientService,
    private typeService: TypesAntecedantService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['Masculin', Validators.required],
      dateNaissance: [''],
      telephone: [''],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      adresse: [''],
      antecedents: this.fb.array([]),
    });
    this.form.get('motDePasse')?.setValue(this.generatePassword());

    // Charger les types d'antécédent depuis le service (pattern Chambres)
    this.typeService.getAll().subscribe({
      next: (types: TypeAntecedant[]) => {
        this.typeOptions = types.map((t) => ({ id: t.publicId, label: t.libelle }));
      },
      error: () => toast.error('Erreur lors du chargement des types d’antécédent'),
    });
  }

  regeneratePassword(doNotShow = false) {
    this.form.get('motDePasse')?.setValue(this.generatePassword());
    if (!doNotShow) toast.success('Mot de passe régénéré');
  }

  private generatePassword(length = 12): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@$!%*?&';
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return pwd;
  }

  // Dropdown Type d'antécédent
  typeDropdownOpenIndex: number | null = null;
  typeSearch = '';
  typeActiveIndex = -1;
  // Options et filtrage façon Chambres
  typeOptions: { id: string; label: string }[] = [];
  get filteredTypeOptions(): { id: string; label: string }[] {
    const q = this.typeSearch.trim().toLowerCase();
    if (!q) return this.typeOptions;
    return this.typeOptions.filter((t) => t.label.toLowerCase().includes(q));
  }

  toggleTypeDropdown(i: number) {
    this.typeDropdownOpenIndex = this.typeDropdownOpenIndex === i ? null : i;
    this.typeSearch = '';
    this.typeActiveIndex = -1;
  }

  selectType(i: number, option: { id: string; label: string }) {
    const group = this.antecedents.at(i) as FormGroup;
    group.get('type')?.setValue(option.label);
    group.get('typeId')?.setValue(option.id);
    this.typeDropdownOpenIndex = null;
  }

  get antecedents(): FormArray {
    return this.form.get('antecedents') as FormArray;
  }

  addAntecedent() {
    this.antecedents.push(
      this.fb.group({
        type: [''], // libellé pour affichage
        typeId: [''], // UUID du type pour envoi API
        description: [''],
      })
    );
  }

  removeAntecedent(index: number) {
    this.antecedents.removeAt(index);
  }

  submit() {
    if (this.form.invalid) return;
    const formValue = this.form.value as any;
    const payload = {
      ...formValue,
      sexe:
        formValue.sexe === 'Masculin'
          ? 'Masculin'
          : formValue.sexe === 'Feminin'
          ? 'Feminin'
          : formValue.sexe,
      statut: 'actif',
    };

    this.service.create(payload).subscribe({
      next: (result) => {
        const antecedentsList: { description: string; typeId: string }[] = (
          this.antecedents.value || []
        ).map((a: any) => ({ description: a.description, typeId: a.typeId }));

        if (!antecedentsList.length) {
          toast.success('Patient créé');
          this.router.navigate(['/dashboard/infirmier/patients/list']);
          return;
        }

        const dossierId$ = result?.dossierPublicId
          ? of(result.dossierPublicId)
          : this.dossierService
              .getByPublicId(result.publicId)
              .pipe(map((d) => (d ? (d as any).publicId : '')));

        dossierId$.subscribe({
          next: (dossierId) => {
            if (!dossierId) {
              toast.error("Dossier patient introuvable pour l'enregistrement des antécédents");
              this.router.navigate(['/dashboard/infirmier/patients/list']);
              return;
            }

            const calls = antecedentsList
              .filter((a) => a.description && a.typeId)
              .map((a) =>
                this.antecedentService.create({
                  description: a.description,
                  idTypeAntecedant: a.typeId,
                  dossierPatient: dossierId,
                })
              );

            if (!calls.length) {
              toast.success('Patient créé');
              this.router.navigate(['/dashboard/infirmier/patients/list']);
              return;
            }

            forkJoin(calls).subscribe({
              next: () => {
                toast.success('Patient et antécédents créés');
                this.router.navigate(['/dashboard/infirmier/patients/list']);
              },
              error: () => {
                toast.error("Erreur lors de l'enregistrement des antécédents");
                this.router.navigate(['/dashboard/infirmier/patients/list']);
              },
            });
          },
          error: () => {
            toast.error('Erreur lors de la récupération du dossier patient');
            this.router.navigate(['/dashboard/infirmier/patients/list']);
          },
        });
      },
      error: () => toast.error('Erreur lors de la création du patient'),
    });
  }
}
