import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClubCard from '@/components/ClubCard.vue'

const stubs = {
  RouterLink: {
    template: '<a><slot /></a>',
    props: ['to']
  }
}

describe('ClubCard', () => {
  it('affiche le titre du club', () => {
    const wrapper = mount(ClubCard, {
      props: {
        titre: 'Club Med Bali',
        description: 'Un super club',
        notemoyenne: 4.5,
        photoUrl: 'bali.jpg',
        prix: 1200,
        idclub: 1,
        nomPays: 'Indonésie'
      },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('Club Med Bali')
  })

  it('affiche le nom du pays', () => {
    const wrapper = mount(ClubCard, {
      props: {
        titre: 'Club Med Nice',
        notemoyenne: 3,
        prix: 800,
        idclub: 2,
        nomPays: 'France'
      },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('France')
  })

  it('affiche le prix', () => {
    const wrapper = mount(ClubCard, {
      props: {
        titre: 'Club Test',
        prix: 950,
        idclub: 3,
        nomPays: 'Espagne'
      },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('950')
  })

  it('affiche la note moyenne', () => {
    const wrapper = mount(ClubCard, {
      props: {
        titre: 'Club Note',
        notemoyenne: 4.2,
        prix: 600,
        idclub: 4,
        nomPays: 'Italie'
      },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('4.2')
  })

  it('se monte sans erreur avec des props minimales', () => {
    const wrapper = mount(ClubCard, {
      props: {
        titre: 'Test',
        idclub: 5
      },
      global: { stubs }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('contient un lien vers le club', () => {
    const wrapper = mount(ClubCard, {
      props: {
        titre: 'Club Lien',
        idclub: 42,
        prix: 500
      },
      global: { stubs }
    })
    expect(wrapper.find('a').exists()).toBe(true)
  })
})
