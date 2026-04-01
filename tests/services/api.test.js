import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

vi.mock('axios', () => {
  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
  return {
    default: {
      create: vi.fn(() => mockInstance),
      __mockInstance: mockInstance
    }
  }
})

describe('api service', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('crée une instance axios avec la bonne baseURL', async () => {
    await import('@/services/api')
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.stringContaining('apiclubmed'),
        withCredentials: true
      })
    )
  })

  it('configure les headers Content-Type et Accept en JSON', async () => {
    await import('@/services/api')
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
      })
    )
  })

  it('enregistre un intercepteur de response', async () => {
    const mod = await import('@/services/api')
    const instance = mod.default
    expect(instance.interceptors.response.use).toHaveBeenCalled()
  })
})
