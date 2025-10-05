import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PatientsService, Patient } from '../patients.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-patients-edit-nurse',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6" *ngIf="loaded">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800">Modifier patient {{ patientId }}</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom</label>
            <input type="text" class="input" formControlName="nom" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Prénom</label>
            <input type="text" class="input" formControlName="prenom" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Sexe</label>
            <select class="input" formControlName="sexe">
              <option value="H">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input type="date" class="input" formControlName="dateNaissance" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input type="text" class="input" formControlName="telephone" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" class="input" formControlName="email" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Adresse</label>
            <input type="text" class="input" formControlName="adresse" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Statut</label>
            <select class="input" formControlName="statut">
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
            Enregistrer
          </button>
          <a class="btn btn-secondary" [routerLink]="['/dashboard/infirmier/patients/list']"
            >Annuler</a
          >
        </div>
      </form>
    </div>
  `,
})
export class PatientsEditNurseComponent implements OnInit {
  form: FormGroup;

  loaded = false;
  patientId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private service: PatientsService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['H', Validators.required],
      dateNaissance: [''],
      telephone: [''],
      email: ['', Validators.email],
      adresse: [''],
      statut: ['actif', Validators.required],
    });
  }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.patientId) {
      this.router.navigate(['/dashboard/infirmier/patients/list']);
      return;
    }

    this.service.getById(this.patientId).subscribe((p) => {
      if (!p) {
        toast.error('Patient introuvable');
        this.router.navigate(['/dashboard/infirmier/patients/list']);
        return;
      }
      this.form.patchValue(p);
      this.loaded = true;
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.service
      .update(this.patientId, this.form.value as Partial<Patient>)
      .subscribe((updated) => {
        if (updated) {
          toast.success('Patient mis à jour');
          this.router.navigate(['/dashboard/infirmier/patients/list']);
        }
      });
  }
}
