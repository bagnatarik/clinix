import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-analyses-view-laborant',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800">Détail de l'analyse</h2>
    </div>
    <div class="bg-white border border-neutral-300 rounded p-4 space-y-2">
      <p class="text-sm text-gray-700">ID: <span class="font-mono">{{ id }}</span></p>
      <p class="text-sm text-gray-600">Contenu de l'analyse (placeholder).</p>
      <div class="flex gap-2 mt-2">
        <button class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 hover:cursor-pointer" (click)="validate()">Valider</button>
        <button class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 hover:cursor-pointer" (click)="reject()">Rejeter</button>
      </div>
    </div>
  `,
})
export class AnalysesViewLaborantComponent {
  id: string | null;
  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  validate() {
    // Placeholder action
    alert(`Analyse ${this.id} validée (placeholder)`);
  }

  reject() {
    // Placeholder action
    alert(`Analyse ${this.id} rejetée (placeholder)`);
  }
}