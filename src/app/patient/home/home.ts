import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Bienvenue sur votre espace patient</h2>
      <p class="text-sm text-gray-700">Utilisez le menu pour accéder à vos rendez-vous, consultations, analyses et profil.</p>
    </div>
  `,
})
export class PatientHome {}