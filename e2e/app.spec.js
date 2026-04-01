import { test, expect } from '@playwright/test'

test.describe('Navigation generale', () => {
  test('la page d accueil se charge correctement', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/')
    await expect(page.locator('.input-destination')).toBeVisible()
  })

  test('naviguer vers la page connexion', async ({ page }) => {
    await page.goto('/connexion')
    await expect(page.locator('h1')).toContainText('Connexion')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('naviguer vers la page FAQ', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.locator('h1')).toContainText('FAQ')
    await expect(page.locator('.faq-item').first()).toBeVisible()
  })

  test('naviguer vers la page clubs', async ({ page }) => {
    await page.goto('/clubs')
    await expect(page).toHaveURL('/clubs')
  })

  test('naviguer vers la page creation de compte', async ({ page }) => {
    await page.goto('/creation')
    await expect(page).toHaveURL('/creation')
  })

  test('naviguer vers politique de confidentialite', async ({ page }) => {
    await page.goto('/politique-de-confidentialite')
    await expect(page).toHaveURL('/politique-de-confidentialite')
  })
})

test.describe('Page d accueil', () => {
  test('le champ de recherche destination est present', async ({ page }) => {
    await page.goto('/')
    const input = page.locator('.input-destination')
    await expect(input).toBeVisible()
    await expect(input).toHaveAttribute('placeholder', /Destination/i)
  })

  test('le date picker est present', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#date-picker-wrapper')).toBeVisible()
  })

  test('le champ participants est present', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.input-participants')).toBeVisible()
  })
})

test.describe('Page connexion', () => {
  test('le formulaire de connexion est complet', async ({ page }) => {
    await page.goto('/connexion')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('affiche une erreur avec des identifiants vides', async ({ page }) => {
    await page.goto('/connexion')
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('le champ email accepte du texte', async ({ page }) => {
    await page.goto('/connexion')
    await page.locator('input[type="email"]').fill('test@example.com')
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com')
  })

  test('le champ mot de passe accepte du texte', async ({ page }) => {
    await page.goto('/connexion')
    await page.locator('input[type="password"]').fill('monmotdepasse')
    await expect(page.locator('input[type="password"]')).toHaveValue('monmotdepasse')
  })
})

test.describe('Page FAQ', () => {
  test('les categories FAQ sont presentes', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.locator('#cat1')).toBeVisible()
    await expect(page.locator('#cat2')).toBeVisible()
    await expect(page.locator('#cat3')).toBeVisible()
  })

  test('un item FAQ peut etre ouvert au clic', async ({ page }) => {
    await page.goto('/faq')
    const firstItem = page.locator('.question-header').first()
    await firstItem.click()
    await expect(page.locator('.faq-item.is-open').first()).toBeVisible()
  })
})
