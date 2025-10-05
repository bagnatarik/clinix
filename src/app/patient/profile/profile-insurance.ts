import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-profile-insurance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Assurance</h2>
      <div class="border border-neutral-300 rounded p-4 text-sm text-gray-700">
        Informations d'assurance (placeholder)
      </div>
    </div>
  `,
})
export class PatientProfileInsurance {}