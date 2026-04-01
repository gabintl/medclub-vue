import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ReservationCard from '@/components/ReservationCard.vue'

describe('ReservationCard', () => {
  it('se monte sans erreur', () => {
    const wrapper = mount(ReservationCard, {
      props: {
        numreservation: 1,
        prix_total: 1500
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('affiche le numero de reservation', () => {
    const wrapper = mount(ReservationCard, {
      props: {
        numreservation: 42,
        prix_total: 2000
      }
    })
    expect(wrapper.text()).toContain('42')
  })

  it('affiche le prix total', () => {
    const wrapper = mount(ReservationCard, {
      props: {
        numreservation: 1,
        prix_total: 3500
      }
    })
    expect(wrapper.text()).toContain('3500')
  })

  it('se monte avec des props zero', () => {
    const wrapper = mount(ReservationCard, {
      props: {
        numreservation: 0,
        prix_total: 0
      }
    })
    expect(wrapper.exists()).toBe(true)
  })
})
