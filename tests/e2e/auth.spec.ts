import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('homepage loads and redirects to locale', async ({ page }) => {
    await page.goto('/')
    // Should redirect to /el (default locale)
    await expect(page).toHaveURL(/\/(el|en)/)
  })

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/el/login')
    await expect(page).toHaveTitle(/Alumni Connect/)
  })

  test('register page renders correctly', async ({ page }) => {
    await page.goto('/el/register')
    await expect(page).toHaveTitle(/Alumni Connect/)
  })
})
