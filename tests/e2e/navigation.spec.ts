import { test, expect } from '@playwright/test'

test.describe('Main Menu Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display main menu with all navigation cards', async ({ page }) => {
    // Check if main menu elements are visible
    await expect(page.getByText('Akhlak Tahun Dua KSRI')).toBeVisible()
    await expect(page.getByText('Aplikasi Pembelajaran Interaktif')).toBeVisible()
    await expect(page.getByText('Mod Belajar')).toBeVisible()
    await expect(page.getByText('Mod Kuiz')).toBeVisible()
    await expect(page.getByText('Mod Ujian')).toBeVisible()
    await expect(page.getByText('Papan Markah')).toBeVisible()
  })

  test('should navigate to Study Mode when clicked', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    await expect(page).toHaveURL('/study')
    await expect(page.getByText('Mod Belajar')).toBeVisible()
  })

  test('should navigate to Quiz Mode when clicked', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await expect(page).toHaveURL('/quiz')
    await expect(page.getByText('Mod Kuiz')).toBeVisible()
  })

  test('should navigate to Test Mode when clicked', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await expect(page).toHaveURL('/test')
    await expect(page.getByText('Mod Ujian')).toBeVisible()
  })

  test('should navigate to Leaderboard when clicked', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    await expect(page).toHaveURL('/leaderboard')
    await expect(page.getByText('Papan Markah')).toBeVisible()
  })

  test('should return to main menu from any page', async ({ page }) => {
    // Navigate to Study Mode
    await page.getByText('Mod Belajar').click()
    await expect(page).toHaveURL('/study')
    
    // Click back to main menu
    await page.getByText('Kembali ke Menu Utama').click()
    await expect(page).toHaveURL('/')
    await expect(page.getByText('Akhlak Tahun Dua KSRI')).toBeVisible()
  })

  test('should display user selection modal when no user is selected', async ({ page }) => {
    // This test assumes the modal opens automatically when no user is selected
    // The actual behavior depends on the UserContext implementation
    await expect(page.getByText('Pilih Pengguna')).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if elements are still visible on mobile
    await expect(page.getByText('Mod Belajar')).toBeVisible()
    await expect(page.getByText('Mod Kuiz')).toBeVisible()
    await expect(page.getByText('Mod Ujian')).toBeVisible()
    await expect(page.getByText('Papan Markah')).toBeVisible()
  })

  test('should display placeholder content on mode pages', async ({ page }) => {
    // Test Study Mode placeholder
    await page.getByText('Mod Belajar').click()
    await expect(page.getByText('Mod Belajar akan datang tidak lama lagi!')).toBeVisible()
    
    // Test Quiz Mode placeholder
    await page.getByText('Kembali ke Menu Utama').click()
    await page.getByText('Mod Kuiz').click()
    await expect(page.getByText('Mod Kuiz akan datang tidak lama lagi!')).toBeVisible()
    
    // Test Test Mode placeholder
    await page.getByText('Kembali ke Menu Utama').click()
    await page.getByText('Mod Ujian').click()
    await expect(page.getByText('Mod Ujian akan datang tidak lama lagi!')).toBeVisible()
    
    // Test Leaderboard placeholder
    await page.getByText('Kembali ke Menu Utama').click()
    await page.getByText('Papan Markah').click()
    await expect(page.getByText('Papan Markah akan datang tidak lama lagi!')).toBeVisible()
  })
})
