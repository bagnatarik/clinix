import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultats-view-laborant',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-gray-800">Détail résultat d’analyse</h2>
      <div class="border border-neutral-300 rounded p-4 text-sm text-gray-700 space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-gray-500">ID</div>
            <div class="font-medium">RA-2201</div>
          </div>
          <div>
            <div class="text-gray-500">Patient</div>
            <div class="font-medium">Amine B.</div>
          </div>
          <div>
            <div class="text-gray-500">Analyse</div>
            <div class="font-medium">Hémogramme</div>
          </div>
          <div>
            <div class="text-gray-500">Date</div>
            <div class="font-medium">2025-10-03</div>
          </div>
        </div>
        <div>
          <div class="text-gray-500">Conclusion</div>
          <p class="font-medium">Conclusion et rapport détaillé de l’analyse (placeholder).</p>
        </div>
        <div class="flex gap-2 justify-end">
          <button class="px-4 py-2 bg-green-600 text-white rounded" (click)="valider()">Valider</button>
          <button class="px-4 py-2 bg-red-600 text-white rounded" (click)="rejeter()">Rejeter</button>
        </div>
      </div>
    </div>
  `,
})
export class ResultatsViewLaborantComponent {
  constructor(private router: Router) {}
  valider() { /* TODO: service de validation */ this.router.navigate(['/dashboard/laborant/resultats-analyses/list']); }
  rejeter() { /* TODO: service de rejet */ this.router.navigate(['/dashboard/laborant/resultats-analyses/list']); }
}