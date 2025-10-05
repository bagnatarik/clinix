import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-consultations-download',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Télécharger compte-rendu</h2>
      <p class="text-sm text-gray-700">Consultation ID: {{ id }}</p>
      <button class="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">Télécharger PDF</button>
    </div>
  `,
})
export class PatientConsultationsDownload {
  id: string | null;
  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}