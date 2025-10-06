import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Bienvenue sur votre espace patient</h2>
      <p class="text-sm text-gray-700">Accédez rapidement à vos rendez-vous, consultations, analyses et profil.</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a [routerLink]="['/patient/rdv/list']" class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition">
          <div class="font-semibold text-gray-800">Mes rendez-vous</div>
          <div class="text-xs text-gray-600">Consulter vos RDV et en prendre un nouveau</div>
        </a>
        <a [routerLink]="['/patient/consultations/list']" class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition">
          <div class="font-semibold text-gray-800">Mes consultations</div>
          <div class="text-xs text-gray-600">Historique et comptes-rendus</div>
        </a>
        <a [routerLink]="['/patient/analyses/list']" class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition">
          <div class="font-semibold text-gray-800">Mes analyses</div>
          <div class="text-xs text-gray-600">Résultats et téléchargements</div>
        </a>
        <a [routerLink]="['/patient/profile/info']" class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition">
          <div class="font-semibold text-gray-800">Mon profil</div>
          <div class="text-xs text-gray-600">Informations personnelles</div>
        </a>
        <a [routerLink]="['/patient/profile/insurance']" class="block bg-white border border-neutral-300 rounded p-4 hover:shadow-sm transition">
          <div class="font-semibold text-gray-800">Mon assurance</div>
          <div class="text-xs text-gray-600">Informations d’assurance</div>
        </a>
      </div>
    </div>
  `,
})
export class PatientHome {}