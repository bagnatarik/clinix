import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../authentication/services/authentication-service';

@Component({
  selector: 'app-patient-profile-insurance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Mon assurance</h2>

      <div class="border border-neutral-300 rounded p-4 bg-white">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p class="text-xs font-semibold text-gray-600">Assuré</p>
            <p>{{ insuredName }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600">Compagnie</p>
            <p>{{ insurance.company }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600">Numéro de police</p>
            <p>{{ insurance.policyNumber }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600">Statut</p>
            <p>
              <span class="inline-block px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">{{ insurance.status }}</span>
            </p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600">Date de début</p>
            <p>{{ insurance.startDate }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600">Date de fin</p>
            <p>{{ insurance.endDate }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600">Taux de couverture</p>
            <p>{{ insurance.coverageRate }}%</p>
          </div>
        </div>
      </div>

      <div class="text-xs text-gray-500">Informations d’assurance fictives à titre d’exemple.</div>
    </div>
  `,
})
export class PatientProfileInsurance {
  insuredName: string;
  insurance = {
    company: 'Mutuelle Santé Plus',
    policyNumber: 'POL-2024-001',
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    coverageRate: 80,
    status: 'active',
  };

  constructor(private auth: AuthenticationService) {
    this.insuredName = this.auth.getCurrentUser()?.name ?? 'Patient User';
  }
}