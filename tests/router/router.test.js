import { describe, it, expect } from 'vitest'
import router from '@/router/index.js'

describe('Router', () => {
  it('contient une route pour la page d accueil', () => {
    const routes = router.getRoutes()
    const home = routes.find(r => r.path === '/')
    expect(home).toBeDefined()
    expect(home.name).toBe('home')
  })

  it('contient une route pour les sejours', () => {
    const routes = router.getRoutes()
    const sejours = routes.find(r => r.path === '/sejours')
    expect(sejours).toBeDefined()
  })

  it('contient une route pour la connexion', () => {
    const routes = router.getRoutes()
    const connexion = routes.find(r => r.path === '/connexion')
    expect(connexion).toBeDefined()
    expect(connexion.name).toBe('connexion')
  })

  it('contient une route pour la creation de compte', () => {
    const routes = router.getRoutes()
    const creation = routes.find(r => r.path === '/creation')
    expect(creation).toBeDefined()
  })

  it('contient une route pour la recherche de clubs', () => {
    const routes = router.getRoutes()
    const clubs = routes.find(r => r.path === '/clubs')
    expect(clubs).toBeDefined()
    expect(clubs.name).toBe('clubs')
  })

  it('contient une route pour un club specifique avec parametre id', () => {
    const routes = router.getRoutes()
    const club = routes.find(r => r.path === '/club/:id')
    expect(club).toBeDefined()
    expect(club.name).toBe('club')
  })

  it('contient une route pour le compte utilisateur', () => {
    const routes = router.getRoutes()
    const compte = routes.find(r => r.path === '/compte')
    expect(compte).toBeDefined()
    expect(compte.name).toBe('compte')
  })

  it('contient une route pour les clubs par pays', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/destinations/pays/:id')
    expect(route).toBeDefined()
    expect(route.name).toBe('clubs-par-pays')
  })

  it('contient une route pour les clubs par continent', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/destinations/continent/:id')
    expect(route).toBeDefined()
    expect(route.name).toBe('clubs-par-continent')
  })

  it('contient une route pour les clubs par regroupement', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/clubs/regroupement/:id')
    expect(route).toBeDefined()
    expect(route.name).toBe('clubs-par-regroupement')
  })

  it('contient une route pour donner un avis', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/donner-avis')
    expect(route).toBeDefined()
  })

  it('contient une route pour la reservation', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/reservation')
    expect(route).toBeDefined()
  })

  it('contient une route directeur-vente', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/directeur-vente')
    expect(route).toBeDefined()
  })

  it('contient une route directeur-marketing', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/directeur-marketing')
    expect(route).toBeDefined()
  })

  it('contient une route membre-vente', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/membre-vente')
    expect(route).toBeDefined()
  })

  it('contient une route validation partenaire', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/validation')
    expect(route).toBeDefined()
  })

  it('contient une route FAQ', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/faq')
    expect(route).toBeDefined()
  })

  it('contient une route politique de confidentialite', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/politique-de-confidentialite')
    expect(route).toBeDefined()
  })

  it('contient une route informations legales', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/informations-legales')
    expect(route).toBeDefined()
  })

  it('contient une route charte cookie', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/charte-cookie')
    expect(route).toBeDefined()
  })

  it('contient une route charte donnees', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/charte-donnees')
    expect(route).toBeDefined()
  })

  it('la route admin propositions requiert authentification', () => {
    const routes = router.getRoutes()
    const route = routes.find(r => r.path === '/admin/propositions')
    expect(route).toBeDefined()
    expect(route.meta.requiresAuth).toBe(true)
    expect(route.meta.requiresVente).toBe(true)
  })

  it('contient au moins 20 routes', () => {
    const routes = router.getRoutes()
    expect(routes.length).toBeGreaterThanOrEqual(20)
  })
})
