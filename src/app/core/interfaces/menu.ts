export type MenuChild = { label: string; route: string; icon?: string };
export type MenuItem = {
  label: string;
  slug: string;
  route: string;
  icon?: string;
  children?: MenuChild[];
  permissions?: string[];
};
export type MenusByRole = Record<string, MenuItem[]>;

export const MENUS_BY_ROLE: MenusByRole = {
  doctor: [
    {
      label: 'Dashboard',
      slug: 'dashboard',
      route: '/dashboard/home',
    },
    {
      label: 'Consultations',
      slug: 'doctor-consultations',
      route: '/dashboard/doctor/consultations',
      children: [
        { label: 'Mes consultations', route: '/dashboard/doctor/consultations/list' },
        { label: 'Nouvelle consultation', route: '/dashboard/doctor/consultations/new' },
      ],
    },
    {
      label: 'Prescriptions',
      slug: 'doctor-prescriptions',
      route: '/dashboard/doctor/prescriptions',
      children: [
        { label: 'Mes prescriptions', route: '/dashboard/doctor/prescriptions/list' },
        { label: 'Nouvelle prescription', route: '/dashboard/doctor/prescriptions/new' },
      ],
    },
    {
      label: 'Rendez-vous',
      slug: 'doctor-rendezvous',
      route: '/dashboard/doctor/rendezvous',
      children: [{ label: 'Mes rendez-vous', route: '/dashboard/doctor/rendezvous/list' }],
    },
    {
      label: 'Diagnostics',
      slug: 'doctor-diagnostics',
      route: '/dashboard/doctor/diagnostics',
      children: [
        { label: 'Historique diagnostics', route: '/dashboard/doctor/diagnostics/list' },
        { label: 'Ajouter un diagnostic', route: '/dashboard/doctor/diagnostics/new' },
      ],
    },
    {
      label: 'Hospitalisations',
      slug: 'doctor-hospitalisations',
      route: '/dashboard/doctor/hospitalisations',
      children: [
        { label: 'Suivi hospitalisations', route: '/dashboard/doctor/hospitalisations/list' },
        { label: 'Nouvelle hospitalisation', route: '/dashboard/doctor/hospitalisations/new' },
      ],
    },
    {
      label: 'Ordonnances',
      slug: 'doctor-ordonnances',
      route: '/dashboard/doctor/ordonnances',
      children: [
        { label: 'Mes ordonnances', route: '/dashboard/doctor/ordonnances/list' },
        { label: 'Créer ordonnance', route: '/dashboard/doctor/ordonnances/new' },
      ],
    },
  ],

  nurse: [
    {
      label: 'Dashboard',
      slug: 'dashboard',
      route: '/dashboard/home',
    },
    {
      label: 'Patients',
      slug: 'infirmier-patients',
      route: '/dashboard/infirmier/patients',
      children: [
        { label: 'Liste patients', route: '/dashboard/infirmier/patients/list' },
        { label: 'Nouveau patient', route: '/dashboard/infirmier/patients/new' },
      ],
    },
    {
      label: 'Rendez-vous',
      slug: 'infirmier-rendezvous',
      route: '/dashboard/infirmier/rendezvous',
      children: [
        { label: 'Mes rendez-vous', route: '/dashboard/infirmier/rendezvous/list' },
        { label: 'Nouveau rendez-vous', route: '/dashboard/infirmier/rendezvous/new' },
      ],
    },
    {
      label: 'Prélèvements',
      slug: 'infirmier-prelevements',
      route: '/dashboard/infirmier/prelevements',
      children: [
        { label: 'Mes prélèvements', route: '/dashboard/infirmier/prelevements/list' },
        { label: 'Nouveau prélèvement', route: '/dashboard/infirmier/prelevements/new' },
      ],
    },
    {
      label: 'Traitements',
      slug: 'infirmier-traitements',
      route: '/dashboard/infirmier/traitements',
      children: [
        { label: 'Suivi traitements', route: '/dashboard/infirmier/traitements/list' },
        { label: 'Ajouter traitement', route: '/dashboard/infirmier/traitements/new' },
      ],
    },
    {
      label: 'Hospitalisations',
      slug: 'infirmier-hospitalisations',
      route: '/dashboard/infirmier/hospitalisations',
      children: [
        { label: 'Mes hospitalisations', route: '/dashboard/infirmier/hospitalisations/list' },
        { label: 'Attribuer chambre', route: '/dashboard/infirmier/hospitalisations/new' },
      ],
    },
    {
      label: 'Facturation',
      slug: 'infirmier-facturation',
      route: '/dashboard/infirmier/facturation',
      children: [
        { label: 'Liste factures', route: '/dashboard/infirmier/facturation/list' },
        { label: 'Nouvelle facture', route: '/dashboard/infirmier/facturation/new' },
      ],
    },
  ],

  laborant: [
    {
      label: 'Dashboard',
      slug: 'dashboard',
      route: '/dashboard/home',
    },
    // {
    //   label: 'Diagnostics',
    //   slug: 'laborant-diagnostics',
    //   route: '/dashboard/doctor/diagnostics',
    //   children: [
    //     { label: 'Historique diagnostics', route: '/dashboard/doctor/diagnostics/list' },
    //     { label: 'Ajouter un diagnostic', route: '/dashboard/doctor/diagnostics/new' },
    //   ],
    // },
    {
      label: 'Prélèvements',
      slug: 'laborant-prelevements',
      route: '/dashboard/laborant/prelevements',
      children: [
        { label: 'Mes prélèvements', route: '/dashboard/laborant/prelevements/list' },
        { label: 'Nouveau prélèvement', route: '/dashboard/laborant/prelevements/new' },
      ],
    },
    {
      label: 'Analyses',
      slug: 'laborant-analyses',
      route: '/dashboard/laborant/analyses',
      children: [
        { label: 'Historique analyses', route: '/dashboard/laborant/analyses/list' },
        { label: 'Nouvelle analyse', route: '/dashboard/laborant/analyses/new' },
      ],
    },
    {
      label: "Résultats d'analyses",
      slug: 'laborant-resultats-analyses',
      route: '/dashboard/laborant/resultats-analyses',
      children: [
        { label: 'Historique résultats', route: '/dashboard/laborant/resultats-analyses/list' },
        { label: 'Publier un résultat', route: '/dashboard/laborant/resultats-analyses/new' },
      ],
    },
    {
      label: 'Types de prélèvements',
      slug: 'laborant-types-prelevements',
      route: '/dashboard/types-prelevements',
    },
  ],

  patient: [
    {
      label: 'Dashboard',
      slug: 'dashboard',
      route: '/patient/dashboard',
    },
    {
      label: 'Mes RDV',
      slug: 'patient-rdv',
      route: '/patient/rdv',
      children: [
        { label: 'Prendre RDV', route: '/patient/rdv/new' },
        { label: 'Mes RDV', route: '/patient/rdv/list' },
      ],
    },
    {
      label: 'Mes consultations',
      slug: 'patient-consult',
      route: '/patient/consultations',
      children: [
        { label: 'Historique', route: '/patient/consultations/list' },
        { label: 'Télécharger compte-rendu', route: '/patient/consultations/:id/download' },
      ],
    },
    {
      label: 'Mes analyses',
      slug: 'patient-analyses',
      route: '/patient/analyses',
      children: [
        { label: 'Résultats', route: '/patient/analyses/list' },
        { label: 'Télécharger PDF', route: '/patient/analyses/:id/download' },
      ],
    },
    {
      label: 'Profil',
      slug: 'patient-profile',
      route: '/patient/profile',
      children: [
        { label: 'Mes infos', route: '/patient/profile/info' },
        { label: 'Assurance', route: '/patient/profile/insurance' },
      ],
    },
  ],
  admin: [
    {
      label: 'Dashboard',
      slug: 'dashboard',
      route: '/dashboard/home',
    },
    {
      label: 'Utilisateurs',
      slug: 'admin-user',
      route: '/dashboard/users',
      children: [
        { label: 'Comptes', route: '/dashboard/users/accounts' },
        { label: 'Rôles et permissions', route: '/dashboard/users/roles' },
      ],
    },
    {
      label: 'Gestion du Personnel',
      slug: 'personnels',
      route: '/dashboard/personnels',
      children: [
        { label: 'Spécialités', route: '/dashboard/specialites' },
        { label: 'Professions', route: '/dashboard/professions' },
        { label: 'Personnels', route: '/dashboard/personnels' },
      ],
    },
    {
      label: 'Hospitalisation',
      slug: 'admin-hospitalisation',
      route: '/dashboard/hospitalisation',
      children: [
        { label: 'Etages', route: '/dashboard/hospitalisation/etages' },
        { label: 'Types de chambre', route: '/dashboard/hospitalisation/types-chambre' },
        { label: 'Chambres', route: '/dashboard/hospitalisation/chambres' },
      ],
    },
    {
      label: 'Départements',
      slug: 'departements',
      route: '/dashboard/departements',
    },
    {
      label: 'Produits',
      slug: 'produits',
      route: '/dashboard/produits',
    },
    {
      label: 'Analyses',
      slug: 'admin-analyses',
      route: '/dashboard/analyses',
    },
    {
      label: 'Types de prélèvements',
      slug: 'types-prelevements',
      route: '/dashboard/types-prelevements',
    },
    {
      label: 'Plannification',
      slug: 'plannification',
      route: '/dashboard/plannification',
      children: [
        { label: 'Gardes', route: '/dashboard/gardes' },
        { label: 'Planning', route: '/dashboard/planning' },
      ],
    },
    { label: "Types d'antécédant", slug: 'antecedants', route: '/dashboard/types-antecedant' },
    // {
    //   label: 'Gestion des antécédants',
    //   slug: 'antecedants',
    //   route: '/dashboard/gestion-antecedants',
    //   children: [
    //     { label: "Types d'antécédant", route: '/dashboard/types-antecedant' },
    //     { label: 'Antécédants', route: '/dashboard/antecedants' },
    //   ],
    // },
  ],
};
