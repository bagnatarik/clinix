import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-factures-view-nurse',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="bg-white border border-neutral-200 rounded-lg shadow-sm">
        <div class="px-5 py-4 border-b border-neutral-200">
          <h2 class="text-lg font-semibold text-gray-800">Détail de la facture</h2>
          <p class="text-xs text-gray-500">Visualisation et actions rapides.</p>
        </div>
        <div class="p-5 space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-gray-500">ID</div>
              <div class="font-medium">{{ id }}</div>
            </div>
            <div>
              <div class="text-gray-500">Statut</div>
              <span class="inline-block px-2 py-1 rounded text-xs"
                [class.bg-green-100]="statut==='Payée'"
                [class.text-green-700]="statut==='Payée'"
                [class.bg-yellow-100]="statut==='En attente'"
                [class.text-yellow-700]="statut==='En attente'"
                [class.bg-gray-100]="statut==='Annulée'"
                [class.text-gray-700]="statut==='Annulée'"
              >{{ statut }}</span>
            </div>
            <div>
              <div class="text-gray-500">Patient</div>
              <div class="font-medium">{{ patient }}</div>
            </div>
            <div>
              <div class="text-gray-500">Date</div>
              <div class="font-medium">{{ dateFacture }}</div>
            </div>
          </div>

          <div class="border-t border-neutral-200 pt-4">
            <h3 class="text-sm font-medium text-gray-800 mb-2">Détails</h3>
            <div class="space-y-2">
              <div *ngFor="let d of details" class="flex items-center justify-between text-sm">
                <div class="text-gray-700">{{ d.designation }}</div>
                <div class="font-medium">{{ d.montant | number:'1.2-2' }} DA</div>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3">
              <div class="text-sm text-gray-500">Total</div>
              <div class="font-semibold">{{ total | number:'1.2-2' }} DA</div>
            </div>
          </div>

          <div class="flex gap-3 justify-end">
            <button class="px-4 py-2 text-sm rounded-md border border-neutral-300 text-gray-700 hover:bg-gray-50" (click)="back()">Retour</button>
            <button class="px-4 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-700" (click)="markPaid()">Marquer payée</button>
            <button class="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700" (click)="cancel()">Annuler la facture</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FacturesViewNurseComponent {
  id!: string;
  patient = '—';
  dateFacture = '—';
  statut: 'En attente' | 'Payée' | 'Annulée' = 'En attente';

  details = [
    { designation: 'Consultation infirmière', montant: 500 },
    { designation: 'Prélèvement sanguin', montant: 300 },
  ];

  get total(): number {
    return this.details.reduce((s, d) => s + d.montant, 0);
  }

  constructor(private route: ActivatedRoute, private router: Router) {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam || 'F-XXXX';
    // TODO: Charger facture via service (FACTURES + DETAILS_FACTURATION)
    this.patient = 'Patient Exemple';
    this.dateFacture = '2025-10-04';
  }

  back() { this.router.navigate(['/dashboard/infirmier/facturation/list']); }
  markPaid() { this.statut = 'Payée'; }
  cancel() { this.statut = 'Annulée'; }
}