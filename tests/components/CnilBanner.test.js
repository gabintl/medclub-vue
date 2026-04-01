import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CnilBanner from '@/components/CnilBanner.vue'

describe('CnilBanner', () => {
  it('se monte sans erreur', () => {
    const wrapper = mount(CnilBanner)
    expect(wrapper.exists()).toBe(true)
  })

  it('le composant est vide visuellement (div cache)', () => {
    const wrapper = mount(CnilBanner)
    expect(wrapper.text()).toBe('')
  })
})
