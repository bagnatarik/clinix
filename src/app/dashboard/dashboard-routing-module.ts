import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayout } from '../core/layouts/dashboard-layout/dashboard-layout';
import { Home } from './home/home';
import { UserAccount } from './user-account/user-account';
import { UserRole } from './user-role/user-role';
import { Specialites } from './specialites/specialites';
import { Professions } from './professions/professions';
import { Etages } from './etages/etages';
import { TypesChambre } from './types-chambre/types-chambre';
import { Chambres } from './chambres/chambres';
import { Departements } from './departements/departements';
import { Produits } from './produits/produits';
import { TypesPrelevement } from './types-prelevement/types-prelevement';
import { Gardes } from './gardes/gardes';
import { Planning } from './planning/planning';
import { TypesAntecedant } from './types-antecedant/types-antecedant';
import { Antecedants } from './antecedants/antecedants';
import { Personnels } from './personnels/personnels';
import { roleGuard } from '../core/guards/role-guard';
import { DoctorPlaceholder } from './doctor/doctor-placeholder';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'users/accounts',
        component: UserAccount,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'users/roles',
        component: UserRole,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'specialites',
        component: Specialites,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'professions',
        component: Professions,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'personnels',
        component: Personnels,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'hospitalisation/etages',
        component: Etages,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'hospitalisation/types-chambre',
        component: TypesChambre,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'hospitalisation/chambres',
        component: Chambres,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'departements',
        component: Departements,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'produits',
        component: Produits,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'types-prelevements',
        component: TypesPrelevement,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      { path: 'gardes', component: Gardes, canActivate: [roleGuard], data: { roles: ['admin'] } },
      {
        path: 'planning',
        component: Planning,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'types-antecedant',
        component: TypesAntecedant,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'antecedants',
        component: Antecedants,
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
      },

      {
        path: 'doctor/consultations',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/consultations/consultations-list/consultations-list.component').then(
            (m) => m.ConsultationsListComponent
          ),
      },
      {
        path: 'doctor/consultations/list',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/consultations/consultations-list/consultations-list.component').then(
            (m) => m.ConsultationsListComponent
          ),
      },
      {
        path: 'doctor/consultations/new',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/consultations/consultations-new/consultations-new.component').then(
            (m) => m.ConsultationsNewComponent
          ),
      },

      {
        path: 'doctor/consultations/:id',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/consultations/consultations-view/consultations-view.component').then(
            (m) => m.ConsultationsViewComponent
          ),
      },

      {
        path: 'doctor/prescriptions',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/prescriptions/prescriptions-list/prescriptions-list.component').then(
            (m) => m.PrescriptionsListComponent
          ),
      },
      {
        path: 'doctor/prescriptions/list',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/prescriptions/prescriptions-list/prescriptions-list.component').then(
            (m) => m.PrescriptionsListComponent
          ),
      },
      {
        path: 'doctor/prescriptions/new',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/prescriptions/prescriptions-new/prescriptions-new.component').then(
            (m) => m.PrescriptionsNewComponent
          ),
      },

      // Docteur - Diagnostics
      {
        path: 'doctor/diagnostics',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/diagnostics/diagnostics-list/diagnostics-list.component').then(
            (m) => m.DiagnosticsListComponent
          ),
      },
      {
        path: 'doctor/diagnostics/list',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/diagnostics/diagnostics-list/diagnostics-list.component').then(
            (m) => m.DiagnosticsListComponent
          ),
      },
      {
        path: 'doctor/diagnostics/new',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/diagnostics/diagnostics-new/diagnostics-new.component').then(
            (m) => m.DiagnosticsNewComponent
          ),
      },

      // Docteur - Hospitalisations
      {
        path: 'doctor/hospitalisations',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import(
            './doctor/hospitalisations/hospitalisations-list/hospitalisations-list.component'
          ).then((m) => m.HospitalisationsListComponent),
      },
      {
        path: 'doctor/hospitalisations/list',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import(
            './doctor/hospitalisations/hospitalisations-list/hospitalisations-list.component'
          ).then((m) => m.HospitalisationsListComponent),
      },
      {
        path: 'doctor/hospitalisations/new',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import(
            './doctor/hospitalisations/hospitalisations-new/hospitalisations-new.component'
          ).then((m) => m.HospitalisationsNewComponent),
      },

      // Docteur - Ordonnances
      {
        path: 'doctor/ordonnances',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/ordonnances/ordonnances-list/ordonnances-list.component').then(
            (m) => m.OrdonnancesListComponent
          ),
      },
      {
        path: 'doctor/ordonnances/list',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/ordonnances/ordonnances-list/ordonnances-list.component').then(
            (m) => m.OrdonnancesListComponent
          ),
      },
      {
        path: 'doctor/ordonnances/new',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/ordonnances/ordonnances-new/ordonnances-new.component').then(
            (m) => m.OrdonnancesNewComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
