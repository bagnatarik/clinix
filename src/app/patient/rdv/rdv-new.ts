import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../authentication/services/authentication-service';
import { RendezvousService } from '../../core/services/rendezvous.service';

@Component({
  selector: 'app-patient-rdv-new',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
      <div class="bg-white border border-neutral-300 rounded p-6">
        <h2 class="text-xl font-bold text-gray-800">Prendre un rendez-vous</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <!-- Patient connecté (pas de sélection) -->
          <div class="md:col-span-2">
            <p class="text-xs font-semibold text-gray-600 mb-1">Patient</p>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 border border-neutral-300 rounded bg-neutral-50 text-sm text-gray-800">
              <svg class="size-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21a6.5 6.5 0 0113 0"></path></svg>
              <span>{{ patientName }}</span>
            </div>
          </div>

          <!-- Note: le personnel sera affecté par l’infirmière (commentée) -->
          <!--
          <div class="md:col-span-2">
            <div class="px-3 py-2 text-xs border border-amber-300 bg-amber-50 text-amber-800 rounded">
              Le personnel sera affecté par l’infirmière. Statut: planifié par défaut.
            </div>
          </div>
          -->

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input type="date" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="date" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">Heure</label>
            <input type="time" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="heure" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1">Motif</label>
            <textarea rows="4" class="w-full border border-neutral-300 rounded px-3 py-2 text-sm" formControlName="motif" placeholder="Décrivez le motif du rendez-vous"></textarea>
          </div>
          <!-- Statut non modifiable côté patient (planifié par défaut) -->
        </div>
      </div>

      <div class="flex gap-2">
        <button type="submit" class="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer text-sm" [disabled]="form.invalid">Enregistrer</button>
        <a class="px-5 py-2.5 border border-gray-600 text-gray-600 rounded hover:bg-gray-600 hover:text-white transition hover:cursor-pointer text-sm" [routerLink]="['/patient/rdv/list']">Annuler</a>
      </div>
    </form>
  `,
})
export class RdvNew {
  form: FormGroup;
  patientName: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthenticationService,
    private rendezvous: RendezvousService
  ) {
    this.patientName = this.auth.getCurrentUser()?.name ?? 'Patient';
    this.form = this.fb.group({
      date: [this.today(), Validators.required],
      heure: ['09:00', Validators.required],
      motif: ['', Validators.required],
      statut: ['planifié', Validators.required],
    });
  }

  private today(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Le personnel sera affecté côté infirmier; pas de sélection ici.

  submit() {
    if (this.form.invalid) return;
    const { date, heure, motif, statut } = this.form.value;
    this.rendezvous
      .create({
        date,
        heure,
        motif,
        statut,
        patient: this.patientName,
        personnel: 'À affecter',
      })
      .subscribe(() => {
        this.router.navigate(['/patient/rdv/list']);
      });
  }
}