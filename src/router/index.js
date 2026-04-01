import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sejours',
      name: 'sejours',
      component: () => import('../views/ReservationView.vue'),
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: () => import('../views/ConnexionView.vue'),
    },{
      path: '/creation',
      name: 'creation',
      component: () => import('../views/CreerCompteView.vue'),
    },{
      path: '/clubs',
      name: 'clubs',
      component: () => import('../views/RechercheSejour.vue'),
    },
    {
      path: '/destinations/pays/:id', 
      name: 'clubs-par-pays',
      component: () => import('../views/RechercheSejour.vue'),
    },
    {
      path: '/clubs/regroupement/:id', 
      name: 'clubs-par-regroupement', 
      component: () => import('../views/RechercheSejour.vue')
    },
    {
      path: '/compte', 
      name: 'compte',
      component: () => import('../views/CompteView.vue'),
    },
    {
      path: '/destinations/continent/:id', 
      name: 'clubs-par-continent',
      component: () => import('../views/RechercheSejour.vue'),
    },
    {
      path: '/club/:id', 
      name: 'club',
      component: () => import('../views/ClubView.vue'),
    },
    {
      path: '/inscription', 
      name: 'inscription',
      component: () => import('../views/CreerCompteView.vue'),
    },
    { 
      path: '/donner-avis', 
      name: 'donner-avis',
      component: () => import('../views/DonnerAvisView.vue'),
    },
    { 
      path: '/reservation', 
      name: 'reservation',
      component: () => import('../views/ReservationView.vue'),
    },
    { 
      path: '/directeur-vente', 
      name: 'directeur-vente',
      component: () => import('../views/DirecteurVenteView.vue'),
    },
    { 
      path: '/directeur-marketing', 
      name: 'directeur-marketing',
      component: () => import('../views/DirecteurMarketingView.vue'),
    },
    { 
      path: '/membre-vente', 
      name: 'membre-vente',
      component: () => import('../views/MembreVenteView.vue'),
    },
    {
        path: '/validation',
        name: 'validation',
        component: () => import('../views/ValidationPartenaireView.vue')
    },
    {
        path: '/admin/propositions',
        name: 'GestionPropositions',
        component: () => import('../views/GestionReservation.vue'),
        meta: { requiresAuth: true, requiresVente: true }
    },
    {
        path: '/membre-vente/avis',
        name: 'membre-vente-avis',
        component: () => import('../views/MembreVenteAvisView.vue')
    },
    {
        path: '/membremarketing',
        name: 'MembreMarketing',
        component: () => import('../views/MembreMarketingView.vue')
    },{
      path: '/faq',
      name: 'FAQ',
      component: () => import('../views/FaqView.vue')
  },,{
      path: '/validation-club',
      name: 'validation-club',
      component: () => import('../views/ValidationClubsView.vue')
  },{
  path: '/politique-de-confidentialite',
  name: 'PrivacyPolicy',
  component: () => import('../views/PrivacyPolicy.vue')
},{
  path: '/informations-legales',
  name: 'InfoLegale',
  component: () => import('../views/InfoLegale.vue')
},{
  path: '/charte-cookie',
  name: 'CharteCookie',
  component: () => import('../views/CharteCookie.vue')
},{
  path: '/charte-donnees',
  name: 'CharteDonnees',
  component: () => import('../views/CharteDonnees.vue')
}
  ],
})

export default router
