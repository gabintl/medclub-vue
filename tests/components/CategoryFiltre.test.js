import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryFiltre from '@/components/CategoryFiltre.vue'

const stubs = {
  ClubCard: { template: '<div class="club-card-stub"></div>', props: ['titre', 'idclub', 'photoUrl', 'prix', 'notemoyenne', 'nomPays'] },
  RouterLink: { template: '<a><slot /></a>', props: ['to'] }
}

const baseClubs = [
  { idclub: 1, titre: 'Club A', categorie: [{ nomcategory: 'Luxe' }], pays: { nompays: 'France' } },
  { idclub: 2, titre: 'Club B', categorie: [{ nomcategory: 'Sport' }], pays: { nompays: 'Espagne' } },
  { idclub: 3, titre: 'Club C', categorie: [{ nomcategory: 'Luxe' }, { nomcategory: 'Sport' }], pays: { nompays: 'Italie' } }
]

const baseCategories = [
  { nomcategory: 'Tout' },
  { nomcategory: 'Luxe' },
  { nomcategory: 'Sport' }
]

describe('CategoryFiltre', () => {
  it('se monte sans erreur', () => {
    const wrapper = mount(CategoryFiltre, {
      props: {
        clubs: baseClubs,
        categories: baseCategories,
        categoriesActives: ['Tout']
      },
      global: { stubs }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('affiche tous les clubs quand Tout est actif', () => {
    const wrapper = mount(CategoryFiltre, {
      props: {
        clubs: baseClubs,
        categories: baseCategories,
        categoriesActives: ['Tout']
      },
      global: { stubs }
    })
    const cards = wrapper.findAll('.club-card-stub')
    expect(cards.length).toBe(3)
  })

  it('affiche tous les clubs quand aucune categorie active', () => {
    const wrapper = mount(CategoryFiltre, {
      props: {
        clubs: baseClubs,
        categories: baseCategories,
        categoriesActives: []
      },
      global: { stubs }
    })
    const cards = wrapper.findAll('.club-card-stub')
    expect(cards.length).toBe(3)
  })

  it('filtre les clubs par categorie Luxe', () => {
    const wrapper = mount(CategoryFiltre, {
      props: {
        clubs: baseClubs,
        categories: baseCategories,
        categoriesActives: ['Luxe']
      },
      global: { stubs }
    })
    const cards = wrapper.findAll('.club-card-stub')
    expect(cards.length).toBe(2)
  })

  it('filtre les clubs par categorie Sport', () => {
    const wrapper = mount(CategoryFiltre, {
      props: {
        clubs: baseClubs,
        categories: baseCategories,
        categoriesActives: ['Sport']
      },
      global: { stubs }
    })
    const cards = wrapper.findAll('.club-card-stub')
    expect(cards.length).toBe(2)
  })

  it('emet toggle-category au clic sur une categorie', async () => {
    const wrapper = mount(CategoryFiltre, {
      props: {
        clubs: baseClubs,
        categories: baseCategories,
        categoriesActives: ['Tout']
      },
      global: { stubs }
    })
    const buttons = wrapper.findAll('li')
    if (buttons.length > 0) {
      await buttons[0].trigger('click')
      expect(wrapper.emitted('toggle-category')).toBeTruthy()
    }
  })

  it('limite l affichage a 10 clubs maximum', () => {
    const manyClubs = Array.from({ length: 15 }, (_, i) => ({
      idclub: i,
      titre: `Club ${i}`,
      categorie: [{ nomcategory: 'Luxe' }],
      pays: { nompays: 'France' }
    }))
    const wrapper = mount(CategoryFiltre, {
      props: {
        clubs: manyClubs,
        categories: baseCategories,
        categoriesActives: ['Tout']
      },
      global: { stubs }
    })
    const cards = wrapper.findAll('.club-card-stub')
    expect(cards.length).toBeLessThanOrEqual(10)
  })

  it('retourne 0 club si aucun ne correspond a la categorie', () => {
    const wrapper = mount(CategoryFiltre, {
      props: {
        clubs: baseClubs,
        categories: baseCategories,
        categoriesActives: ['Famille']
      },
      global: { stubs }
    })
    const cards = wrapper.findAll('.club-card-stub')
    expect(cards.length).toBe(0)
  })

  it('gere les clubs sans categorie', () => {
    const clubsSansCategorie = [
      { idclub: 1, titre: 'Club sans cat', pays: { nompays: 'France' } },
      { idclub: 2, titre: 'Club avec cat', categorie: [{ nomcategory: 'Luxe' }], pays: { nompays: 'Espagne' } }
    ]
    const wrapper = mount(CategoryFiltre, {
      props: {
        clubs: clubsSansCategorie,
        categories: baseCategories,
        categoriesActives: ['Luxe']
      },
      global: { stubs }
    })
    const cards = wrapper.findAll('.club-card-stub')
    expect(cards.length).toBe(1)
  })
})
