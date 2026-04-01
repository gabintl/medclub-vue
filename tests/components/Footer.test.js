import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '@/components/Footer.vue'

const stubs = {
  RouterLink: { template: '<a><slot /></a>', props: ['to'] }
}

describe('Footer', () => {
  it('se monte sans erreur', () => {
    const wrapper = mount(Footer, {
      global: { stubs }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('contient des liens', () => {
    const wrapper = mount(Footer, {
      global: { stubs }
    })
    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThan(0)
  })

  it('ne plante pas si tarteaucitron n est pas charge', () => {
    delete window.tarteaucitron
    const wrapper = mount(Footer, {
      global: { stubs }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
