import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 class="text-3xl font-bold text-red-600 mb-4">Accès non autorisé</h1>
        <p class="text-gray-700 mb-6">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <button 
          (click)="goBack()" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Retour à l'accueil
        </button>
      </div>
    </div>
  `
})
export class NotAuthorized {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard/home']);
  }
}