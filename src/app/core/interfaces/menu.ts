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
  ],

  laborant: [
    {
      label: 'Dashboard',
      slug: 'dashboard',
      route: '/dashboard/home',
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
    {
      label: 'Gestion des antécédants',
      slug: 'antecedants',
      route: '/dashboard/gestion-antecedants',
      children: [
        { label: "Types d'antécédant", route: '/dashboard/types-antecedant' },
        { label: 'Antécédants', route: '/dashboard/antecedants' },
      ],
    },
  ],
};
