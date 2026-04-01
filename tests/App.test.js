import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
})

const stubs = {
  CnilBanner: { template: '<div class="cnil-stub"></div>' },
  RouterView: { template: '<div class="router-view-stub"></div>' }
}

describe('App', () => {
  it('se monte sans erreur', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('contient le composant CnilBanner', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs
      }
    })
    expect(wrapper.find('.cnil-stub').exists()).toBe(true)
  })

  it('contient le RouterView', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs
      }
    })
    expect(wrapper.find('.router-view-stub').exists()).toBe(true)
  })
})
