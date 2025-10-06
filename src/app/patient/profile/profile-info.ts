import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsService, Patient } from '../../dashboard/nurse/patients/patients.service';
import { AuthenticationService } from '../../authentication/services/authentication-service';

@Component({
  selector: 'app-patient-profile-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Mes informations</h2>

      @if (loading) {
        <div class="border border-neutral-300 rounded p-4 text-sm text-gray-700">Chargement…</div>
      } @else {
        @if (patient) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-neutral-300 rounded p-4 bg-white">
              <p class="text-sm font-semibold text-gray-800">Identité</p>
              <div class="mt-2 text-sm text-gray-700 space-y-1">
                <div><span class="text-gray-600">Nom:</span> {{ patient.nom }}</div>
                <div><span class="text-gray-600">Prénom:</span> {{ patient.prenom }}</div>
                <div><span class="text-gray-600">Sexe:</span> {{ patient.sexe }}</div>
                <div><span class="text-gray-600">Date de naissance:</span> {{ patient.dateNaissance || '-' }}</div>
              </div>
            </div>

            <div class="border border-neutral-300 rounded p-4 bg-white">
              <p class="text-sm font-semibold text-gray-800">Contact</p>
              <div class="mt-2 text-sm text-gray-700 space-y-1">
                <div><span class="text-gray-600">Email:</span> {{ patient.email || '-' }}</div>
                <div><span class="text-gray-600">Téléphone:</span> {{ patient.telephone || '-' }}</div>
                <div><span class="text-gray-600">Adresse:</span> {{ patient.adresse || '-' }}</div>
              </div>
            </div>

            <div class="border border-neutral-300 rounded p-4 bg-white">
              <p class="text-sm font-semibold text-gray-800">Statut</p>
              <div class="mt-2 text-sm text-gray-700">
                <span class="inline-block px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">{{ patient.statut }}</span>
              </div>
            </div>
          </div>

          @if (patient.id === 'PAT-VIRT') {
            <div class="text-xs text-gray-500">Profil affiché d’après votre compte (données fictives).</div>
          }
        } @else {
          <div class="border border-neutral-300 rounded p-4 text-sm text-gray-700">Aucune information disponible.</div>
        }
      }
    </div>
  `,
})
export class PatientProfileInfo implements OnInit {
  loading = false;
  patient: Patient | null = null;
  private patientName: string;

  constructor(private patientsService: PatientsService, private auth: AuthenticationService) {
    this.patientName = this.auth.getCurrentUser()?.name ?? 'Patient User';
  }

  ngOnInit(): void { this.refresh(); }

  private refresh(): void {
    this.loading = true;
    this.patientsService.getAll().subscribe((list) => {
      const match = list.find((p) => `${p.prenom} ${p.nom}`.trim().toLowerCase() === this.patientName.trim().toLowerCase());
      this.patient = match ?? this.deriveFromUser();
      this.loading = false;
    });
  }

  private deriveFromUser(): Patient {
    const user = this.auth.getCurrentUser();
    const name = user?.name ?? 'Patient User';
    const parts = name.trim().split(' ');
    const prenom = parts.length > 1 ? parts.slice(0, -1).join(' ') : name;
    const nom = parts.length > 1 ? parts.slice(-1).join(' ') : name;
    return {
      id: 'PAT-VIRT',
      prenom,
      nom,
      sexe: 'H',
      email: user?.email,
      statut: 'actif',
    } as Patient;
  }
}