import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-rdv-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Mes RDV</h2>
      <div class="flex justify-end">
        <a
          class="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer text-sm"
          [routerLink]="['/patient/rdv/new']"
        >
          Prendre RDV
        </a>
      </div>
      <div class="border border-neutral-300 rounded p-4 text-sm text-gray-700">
        Historique de mes rendez-vous (placeholder)
      </div>
    </div>
  `,
})
export class RdvList {}