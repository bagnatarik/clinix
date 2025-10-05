import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-profile-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Mes informations</h2>
      <div class="border border-neutral-300 rounded p-4 text-sm text-gray-700">
        Informations du profil (placeholder)
      </div>
    </div>
  `,
})
export class PatientProfileInfo {}