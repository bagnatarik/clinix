import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-consultations-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Mes consultations</h2>
      <div class="border border-neutral-300 rounded p-4 text-sm text-gray-700">
        Historique de mes consultations (placeholder)
      </div>
    </div>
  `,
})
export class PatientConsultationsList {}