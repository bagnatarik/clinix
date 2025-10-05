import { Routes } from '@angular/router';
import { canLoadGuard } from './core/guards/can-load-guard';
import { authenticationGuard } from './core/guards/authentication-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'authentication',
    loadChildren: () =>
      import('./authentication/authentication-routing-module').then(
        (m) => m.AuthenticationRoutingModule
      ),
  },
  {
    path: 'patient',
    canLoad: [canLoadGuard],
    canActivate: [authenticationGuard],
    loadChildren: () =>
      import('./patient/patient-routing-module').then((m) => m.PatientRoutingModule),
  },
  {
    path: 'dashboard',
    canLoad: [canLoadGuard],
    canActivate: [authenticationGuard],
    loadChildren: () =>
      import('./dashboard/dashboard-routing-module').then((m) => m.DashboardRoutingModule),
  },
  {path: 'not-authorized', loadComponent: () => import('./not-authorized/not-authorized').then((mod) => mod.NotAuthorized)},
  {path: '**', redirectTo: 'not-authorized'},
];
