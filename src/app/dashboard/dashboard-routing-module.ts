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
        data: { roles: ['admin', 'laborant'] },
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

      // Admin - Analyses single-page (menu /dashboard/analyses)
      {
        path: 'analyses',
        canActivate: [roleGuard],
        data: { roles: ['admin'] },
        loadComponent: () =>
          import('./admin/analyses/analyses-list/analyses-list.component').then(
            (m) => m.AnalysesListAdminComponent
          ),
      },

      // Admin - Analyses (catalogue)
      // {
      //   path: 'admin/analyses',
      //   canActivate: [roleGuard],
      //   data: { roles: ['admin'] },
      //   loadComponent: () =>
      //     import('./admin/analyses/analyses-list/analyses-list.component').then(
      //       (m) => m.AnalysesListAdminComponent
      //     ),
      // },
      // {
      //   path: 'admin/analyses/list',
      //   canActivate: [roleGuard],
      //   data: { roles: ['admin'] },
      //   loadComponent: () =>
      //     import('./admin/analyses/analyses-list/analyses-list.component').then(
      //       (m) => m.AnalysesListAdminComponent
      //     ),
      // },
      // {
      //   path: 'admin/analyses/new',
      //   canActivate: [roleGuard],
      //   data: { roles: ['admin'] },
      //   loadComponent: () =>
      //     import('./admin/analyses/analyses-new/analyses-new.component').then(
      //       (m) => m.AnalysesNewAdminComponent
      //     ),
      // },
      // {
      //   path: 'admin/analyses/:id/edit',
      //   canActivate: [roleGuard],
      //   data: { roles: ['admin'] },
      //   loadComponent: () =>
      //     import('./admin/analyses/analyses-edit/analyses-edit.component').then(
      //       (m) => m.AnalysesEditAdminComponent
      //     ),
      // },

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

      {
        path: 'doctor/prescriptions/:id',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/prescriptions/prescriptions-view/prescriptions-view.component').then(
            (m) => m.PrescriptionsViewComponent
          ),
      },

      // Docteur - Diagnostics
      {
        path: 'doctor/diagnostics',
        canActivate: [roleGuard],
        data: { roles: ['doctor', 'laborant'] },
        loadComponent: () =>
          import('./doctor/diagnostics/diagnostics-list/diagnostics-list.component').then(
            (m) => m.DiagnosticsListComponent
          ),
      },
      {
        path: 'doctor/diagnostics/list',
        canActivate: [roleGuard],
        data: { roles: ['doctor', 'laborant'] },
        loadComponent: () =>
          import('./doctor/diagnostics/diagnostics-list/diagnostics-list.component').then(
            (m) => m.DiagnosticsListComponent
          ),
      },
      {
        path: 'doctor/diagnostics/new',
        canActivate: [roleGuard],
        data: { roles: ['doctor', 'laborant'] },
        loadComponent: () =>
          import('./doctor/diagnostics/diagnostics-new/diagnostics-new.component').then(
            (m) => m.DiagnosticsNewComponent
          ),
      },

      // Docteur - Hospitalisations
      {
        path: 'doctor/hospitalisations',
        canActivate: [roleGuard],
        data: { roles: ['doctor', 'nurse'] },
        loadComponent: () =>
          import(
            './doctor/hospitalisations/hospitalisations-list/hospitalisations-list.component'
          ).then((m) => m.HospitalisationsListComponent),
      },
      {
        path: 'doctor/hospitalisations/list',
        canActivate: [roleGuard],
        data: { roles: ['doctor', 'nurse'] },
        loadComponent: () =>
          import(
            './doctor/hospitalisations/hospitalisations-list/hospitalisations-list.component'
          ).then((m) => m.HospitalisationsListComponent),
      },
      {
        path: 'doctor/hospitalisations/new',
        canActivate: [roleGuard],
        data: { roles: ['doctor', 'nurse'] },
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

      // Docteur - Rendez-vous
      {
        path: 'doctor/rendezvous',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/rendezvous/rendezvous-list/rendezvous-list.component').then(
            (m) => m.DoctorRendezvousListComponent
          ),
      },
      {
        path: 'doctor/rendezvous/list',
        canActivate: [roleGuard],
        data: { roles: ['doctor'] },
        loadComponent: () =>
          import('./doctor/rendezvous/rendezvous-list/rendezvous-list.component').then(
            (m) => m.DoctorRendezvousListComponent
          ),
      },

      // Infirmier - Prélèvements
      {
        path: 'infirmier/prelevements',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/prelevements/prelevements-list/prelevements-list.component').then(
            (m) => m.PrelevementsListComponent
          ),
      },
      {
        path: 'infirmier/prelevements/list',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/prelevements/prelevements-list/prelevements-list.component').then(
            (m) => m.PrelevementsListComponent
          ),
      },
      {
        path: 'infirmier/prelevements/new',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/prelevements/prelevements-new/prelevements-new.component').then(
            (m) => m.PrelevementsNewComponent
          ),
      },

      // Infirmier - Traitements
      {
        path: 'infirmier/traitements',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/traitements/traitements-list/traitements-list.component').then(
            (m) => m.TraitementsListComponent
          ),
      },
      {
        path: 'infirmier/traitements/list',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/traitements/traitements-list/traitements-list.component').then(
            (m) => m.TraitementsListComponent
          ),
      },
      {
        path: 'infirmier/traitements/new',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/traitements/traitements-new/traitements-new.component').then(
            (m) => m.TraitementsNewComponent
          ),
      },

      // Infirmier - Hospitalisations
      {
        path: 'infirmier/hospitalisations',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import(
            './nurse/hospitalisations/hospitalisations-list/hospitalisations-list.component'
          ).then((m) => m.HospitalisationsListNurseComponent),
      },
      {
        path: 'infirmier/hospitalisations/list',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import(
            './nurse/hospitalisations/hospitalisations-list/hospitalisations-list.component'
          ).then((m) => m.HospitalisationsListNurseComponent),
      },
      {
        path: 'infirmier/hospitalisations/new',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import(
            './nurse/hospitalisations/hospitalisations-new/hospitalisations-new.component'
          ).then((m) => m.HospitalisationsNewNurseComponent),
      },

      // Infirmier - Facturation
      {
        path: 'infirmier/facturation',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/facturation/factures-list/factures-list.component').then(
            (m) => m.FacturesListNurseComponent
          ),
      },
      {
        path: 'infirmier/facturation/list',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/facturation/factures-list/factures-list.component').then(
            (m) => m.FacturesListNurseComponent
          ),
      },
      {
        path: 'infirmier/facturation/new',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/facturation/factures-new/factures-new.component').then(
            (m) => m.FacturesNewNurseComponent
          ),
      },
      {
        path: 'infirmier/facturation/:id',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/facturation/factures-view/factures-view.component').then(
            (m) => m.FacturesViewNurseComponent
          ),
      },

      // Infirmier - Rendez-vous
      {
        path: 'infirmier/rendezvous',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/rendezvous/rendezvous-list/rendezvous-list.component').then(
            (m) => m.RendezvousListComponent
          ),
      },
      {
        path: 'infirmier/rendezvous/list',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/rendezvous/rendezvous-list/rendezvous-list.component').then(
            (m) => m.RendezvousListComponent
          ),
      },
      {
        path: 'infirmier/rendezvous/new',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/rendezvous/rendezvous-new/rendezvous-new.component').then(
            (m) => m.RendezvousNewComponent
          ),
      },

      // Infirmier - Patients
      {
        path: 'infirmier/patients',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/patients/patients-list/patients-list.component').then(
            (m) => m.PatientsListNurseComponent
          ),
      },
      {
        path: 'infirmier/patients/list',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/patients/patients-list/patients-list.component').then(
            (m) => m.PatientsListNurseComponent
          ),
      },
      {
        path: 'infirmier/patients/new',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/patients/patients-new/patients-new.component').then(
            (m) => m.PatientsNewNurseComponent
          ),
      },
      {
        path: 'infirmier/patients/:id/edit',
        canActivate: [roleGuard],
        data: { roles: ['nurse'] },
        loadComponent: () =>
          import('./nurse/patients/patients-edit/patients-edit.component').then(
            (m) => m.PatientsEditNurseComponent
          ),
      },

      // Laborant - Analyses
      {
        path: 'laborant/analyses',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/analyses/analyses-list/analyses-list.component').then(
            (m) => m.AnalysesListLaborantComponent
          ),
      },
      {
        path: 'laborant/analyses/list',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/analyses/analyses-list/analyses-list.component').then(
            (m) => m.AnalysesListLaborantComponent
          ),
      },
      {
        path: 'laborant/analyses/new',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/analyses/analyses-new/analyses-new.component').then(
            (m) => m.AnalysesNewLaborantComponent
          ),
      },
      {
        path: 'laborant/analyses/:id',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/analyses/analyses-view/analyses-view.component').then(
            (m) => m.AnalysesViewLaborantComponent
          ),
      },

      // Laborant - Prélèvements
      {
        path: 'laborant/prelevements',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/prelevements/prelevements-list/prelevements-list.component').then(
            (m) => m.PrelevementsListLaborantComponent
          ),
      },
      {
        path: 'laborant/prelevements/list',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/prelevements/prelevements-list/prelevements-list.component').then(
            (m) => m.PrelevementsListLaborantComponent
          ),
      },
      {
        path: 'laborant/prelevements/new',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/prelevements/prelevements-new/prelevements-new.component').then(
            (m) => m.PrelevementsNewLaborantComponent
          ),
      },

      // Laborant - Résultats d’analyses
      {
        path: 'laborant/resultats-analyses',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/resultats-analyses/resultats-list/resultats-list.component').then(
            (m) => m.ResultatsListLaborantComponent
          ),
      },
      {
        path: 'laborant/resultats-analyses/list',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/resultats-analyses/resultats-list/resultats-list.component').then(
            (m) => m.ResultatsListLaborantComponent
          ),
      },
      {
        path: 'laborant/resultats-analyses/new',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/resultats-analyses/resultats-new/resultats-new.component').then(
            (m) => m.ResultatsNewLaborantComponent
          ),
      },
      {
        path: 'laborant/resultats-analyses/:id',
        canActivate: [roleGuard],
        data: { roles: ['laborant'] },
        loadComponent: () =>
          import('./laborant/resultats-analyses/resultats-view/resultats-view.component').then(
            (m) => m.ResultatsViewLaborantComponent
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
