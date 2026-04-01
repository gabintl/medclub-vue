import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InfoBulle from '@/components/InfoBulle.vue'

const stubs = {
  RouterLink: { template: '<a><slot /></a>', props: ['to'] }
}

describe('InfoBulle', () => {
  it('se monte sans erreur avec le texte requis', () => {
    const wrapper = mount(InfoBulle, {
      props: { text: 'Information utile' },
      global: { stubs }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('affiche le texte passe en prop', () => {
    const wrapper = mount(InfoBulle, {
      props: { text: 'Voici un conseil' },
      global: { stubs }
    })
    expect(wrapper.text()).toContain('Voici un conseil')
  })

  it('se monte sans lien par defaut', () => {
    const wrapper = mount(InfoBulle, {
      props: { text: 'Sans lien' },
      global: { stubs }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('affiche un lien quand la prop link est fournie', () => {
    const wrapper = mount(InfoBulle, {
      props: { text: 'Avec lien', link: '/faq' },
      global: { stubs }
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
  })
})
