import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayout } from '../core/layouts/dashboard-layout/dashboard-layout';
import { roleGuard } from '../core/guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    children: [
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // {
      //   path: 'dashboard',
      //   canActivate: [roleGuard],
      //   data: { roles: ['patient'] },
      //   loadComponent: () => import('./home/home').then((m) => m.PatientHome),
      // },

      // RDV
      {
        path: 'rdv',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () => import('./rdv/rdv-list').then((m) => m.RdvList),
      },
      {
        path: 'rdv/list',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () => import('./rdv/rdv-list').then((m) => m.RdvList),
      },
      {
        path: 'rdv/new',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () => import('./rdv/rdv-new').then((m) => m.RdvNew),
      },

      // Consultations
      {
        path: 'consultations',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () =>
          import('./consultations/consultations-list').then((m) => m.PatientConsultationsList),
      },
      {
        path: 'consultations/list',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () =>
          import('./consultations/consultations-list').then((m) => m.PatientConsultationsList),
      },
      {
        path: 'consultations/:id/download',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () =>
          import('./consultations/consultations-download').then(
            (m) => m.PatientConsultationsDownload
          ),
      },

      // Analyses
      {
        path: 'analyses',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () => import('./analyses/analyses-list').then((m) => m.PatientAnalysesList),
      },
      {
        path: 'analyses/list',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () => import('./analyses/analyses-list').then((m) => m.PatientAnalysesList),
      },
      {
        path: 'analyses/:id/download',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () =>
          import('./analyses/analyses-download').then((m) => m.PatientAnalysesDownload),
      },

      // Ordonnances
      // {
      //   path: 'ordonnances',
      //   canActivate: [roleGuard],
      //   data: { roles: ['patient'] },
      //   loadComponent: () =>
      //     import('./ordonnances/ordonnances-list').then((m) => m.PatientOrdonnancesList),
      // },
      {
        path: 'ordonnances/list',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () =>
          import('./ordonnances/ordonnances-list').then((m) => m.PatientOrdonnancesList),
      },
      {
        path: 'ordonnances/:id',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () =>
          import('../dashboard/doctor/ordonnances/ordonnances-view/ordonnances-view.component').then((m) => m.OrdonnancesViewComponent),
      },

      // Profil
      {
        path: 'profile',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () => import('./profile/profile-info').then((m) => m.PatientProfileInfo),
      },
      {
        path: 'profile/info',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () => import('./profile/profile-info').then((m) => m.PatientProfileInfo),
      },
      {
        path: 'profile/insurance',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () =>
          import('./profile/profile-insurance').then((m) => m.PatientProfileInsurance),
      },
      // Dossier
      {
        path: 'dossier',
        canActivate: [roleGuard],
        data: { roles: ['patient'] },
        loadComponent: () => import('./dossier/dossier').then((m) => m.PatientDossier),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientRoutingModule {}
