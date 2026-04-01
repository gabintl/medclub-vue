import { describe, it, expect } from 'vitest'
import { getClubImageUrl, getStorageUrl } from '@/utils/imageUtils'

describe('imageUtils', () => {
  describe('getClubImageUrl', () => {
    it('retourne une chaîne vide si imagePath est null', () => {
      const result = getClubImageUrl(null)
      expect(result).toBe('')
    })

    it('retourne une chaîne vide si imagePath est undefined', () => {
      const result = getClubImageUrl(undefined)
      expect(result).toBe('')
    })

    it('retourne une chaîne vide si imagePath est vide', () => {
      const result = getClubImageUrl('')
      expect(result).toBe('')
    })

    it('retourne une URL pour un chemin valide', () => {
      const result = getClubImageUrl('club1.jpg')
      expect(typeof result).toBe('string')
    })
  })

  describe('getStorageUrl', () => {
    it('retourne une chaîne vide si imagePath est null', () => {
      expect(getStorageUrl(null)).toBe('')
    })

    it('retourne une chaîne vide si imagePath est undefined', () => {
      expect(getStorageUrl(undefined)).toBe('')
    })

    it('retourne une chaîne vide si imagePath est vide', () => {
      expect(getStorageUrl('')).toBe('')
    })

    it('retourne le chemin tel quel si commence par http', () => {
      const url = 'https://example.com/image.jpg'
      expect(getStorageUrl(url)).toBe(url)
    })

    it('retourne le chemin tel quel si commence par http (sans s)', () => {
      const url = 'http://example.com/image.jpg'
      expect(getStorageUrl(url)).toBe(url)
    })

    it('ajoute le baseUrl pour un chemin relatif', () => {
      const result = getStorageUrl('photos/club1.jpg')
      expect(result).toBe(
        'https://apiclubmed-ddfxd0dwavhhawce.switzerlandnorth-01.azurewebsites.net/storage/photos/club1.jpg'
      )
    })

    it('ajoute le baseUrl pour un simple nom de fichier', () => {
      const result = getStorageUrl('image.png')
      expect(result).toContain('/storage/image.png')
    })
  })
})
