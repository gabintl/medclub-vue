import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NavBar from '@/components/NavBar.vue'

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn((url) => {
      if (url.includes('Localisation')) {
        return Promise.resolve({ data: [{ numLocalisation: 1, nomLocalisation: 'Europe', sousLocalisations: [] }] })
      }
      if (url.includes('Regroupement')) {
        return Promise.resolve({ data: [{ numRegroupement: 1, libelleRegroupement: 'Soleil' }] })
      }
      return Promise.resolve({ data: [] })
    })
  }
}))

const stubs = {
  RouterLink: { template: '<a><slot /></a>', props: ['to'] }
}

describe('NavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('se monte sans erreur', () => {
    const wrapper = mount(NavBar, {
      global: { stubs }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('charge les localisations au montage', async () => {
    const api = (await import('@/services/api')).default
    mount(NavBar, { global: { stubs } })
    await vi.dynamicImportSettled()
    expect(api.get).toHaveBeenCalledWith('/getLocalisationsWithSousLocalisation')
  })

  it('charge les regroupements au montage', async () => {
    const api = (await import('@/services/api')).default
    mount(NavBar, { global: { stubs } })
    await vi.dynamicImportSettled()
    expect(api.get).toHaveBeenCalledWith('/GetAllRegroupement')
  })

  it('contient un element de navigation', () => {
    const wrapper = mount(NavBar, {
      global: { stubs }
    })
    expect(wrapper.find('nav').exists() || wrapper.find('header').exists() || wrapper.find('.navbar').exists()).toBe(true)
  })
})
