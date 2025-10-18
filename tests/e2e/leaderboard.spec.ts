import { test, expect } from '@playwright/test'

test.describe('Leaderboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to leaderboard from main menu', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    await expect(page).toHaveURL('/leaderboard')
    await expect(page.getByText('Papan Markah')).toBeVisible()
  })

  test('should display leaderboard page correctly', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    
    // Check main elements
    await expect(page.getByText('Lihat prestasi terbaik pelajar dalam kuiz dan ujian')).toBeVisible()
    await expect(page.getByText('Jumlah Percubaan')).toBeVisible()
    await expect(page.getByText('Kuiz')).toBeVisible()
    await expect(page.getByText('Ujian')).toBeVisible()
  })

  test('should show statistics cards', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    
    // Check statistics are displayed
    await expect(page.getByText('Jumlah Percubaan')).toBeVisible()
    await expect(page.getByText('Kuiz')).toBeVisible()
    await expect(page.getByText('Ujian')).toBeVisible()
  })

  test('should display filter buttons', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    
    // Check filter buttons
    await expect(page.getByText('Semua')).toBeVisible()
    await expect(page.getByText('Kuiz')).toBeVisible()
    await expect(page.getByText('Ujian')).toBeVisible()
  })

  test('should show empty state when no scores', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    
    // Should show empty state
    await expect(page.getByText('Tiada Markah Lagi')).toBeVisible()
    await expect(page.getByText('Cuba ambil kuiz atau ujian untuk melihat markah anda di sini!')).toBeVisible()
  })

  test('should filter scores by quiz type', async ({ page }) => {
    // First complete a quiz to have some data
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Complete quiz quickly
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    // Go to leaderboard
    await page.getByText('Papan Markah').click()
    
    // Filter by quiz
    await page.getByText('Kuiz').click()
    
    await expect(page.getByText('Papan Markah - Kuiz')).toBeVisible()
  })

  test('should filter scores by test type', async ({ page }) => {
    // First complete a test to have some data
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()
    
    // Complete test quickly
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    // Go to leaderboard
    await page.getByText('Papan Markah').click()
    
    // Filter by test
    await page.getByText('Ujian').click()
    
    await expect(page.getByText('Papan Markah - Ujian')).toBeVisible()
  })

  test('should show all scores when all filter is selected', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    
    // Click different filters and then all
    await page.getByText('Kuiz').click()
    await page.getByText('Semua').click()
    
    await expect(page.getByText('Papan Markah - Semua')).toBeVisible()
  })

  test('should display leaderboard table with correct headers', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    
    // Check table headers
    await expect(page.getByText('Kedudukan')).toBeVisible()
    await expect(page.getByText('Nama Pemain')).toBeVisible()
    await expect(page.getByText('Markah')).toBeVisible()
    await expect(page.getByText('Peratusan')).toBeVisible()
    await expect(page.getByText('Tarikh')).toBeVisible()
    await expect(page.getByText('Jenis')).toBeVisible()
  })

  test('should highlight current user scores', async ({ page }) => {
    // Complete a quiz first
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    // Go to leaderboard
    await page.getByText('Papan Markah').click()
    
    // Should highlight current user
    await expect(page.getByText('Anda')).toBeVisible()
  })

  test('should show rank icons for top positions', async ({ page }) => {
    // Complete multiple quizzes/tests to have data
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    await page.getByText('Papan Markah').click()
    
    // Should show rank icons
    await expect(page.getByText('🥇')).toBeVisible()
  })

  test('should display correct type labels', async ({ page }) => {
    // Complete a quiz
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    await page.getByText('Papan Markah').click()
    
    // Should show type labels
    await expect(page.getByText('Kuiz')).toBeVisible()
  })

  test('should show progress bars for percentages', async ({ page }) => {
    // Complete a quiz
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    await page.getByText('Papan Markah').click()
    
    // Should show percentage progress bars
    await expect(page.getByText('%')).toBeVisible()
  })

  test('should format dates correctly', async ({ page }) => {
    // Complete a quiz
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    await page.getByText('Papan Markah').click()
    
    // Should show formatted dates
    await expect(page.getByText('Hari ini')).toBeVisible()
  })

  test('should show encouragement message', async ({ page }) => {
    // Complete a quiz
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    await page.getByText('Papan Markah').click()
    
    // Should show encouragement message
    await expect(page.getByText('Teruskan Berusaha!')).toBeVisible()
    await expect(page.getByText('Setiap percubaan adalah langkah ke arah kecemerlangan.')).toBeVisible()
  })

  test('should navigate back to menu', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    
    await page.getByText('Kembali ke Menu').click()
    
    // Should be back at main menu
    await expect(page).toHaveURL('/')
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.getByText('Papan Markah').click()
    
    // Check if leaderboard is visible on mobile
    await expect(page.getByText('Papan Markah')).toBeVisible()
    await expect(page.getByText('Jumlah Percubaan')).toBeVisible()
  })

  test('should update filter button states', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    
    // Click different filters
    await page.getByText('Kuiz').click()
    await page.getByText('Ujian').click()
    await page.getByText('Semua').click()
    
    // All buttons should be clickable
    await expect(page.getByText('Semua')).toBeVisible()
    await expect(page.getByText('Kuiz')).toBeVisible()
    await expect(page.getByText('Ujian')).toBeVisible()
  })

  test('should show footer message', async ({ page }) => {
    await page.getByText('Papan Markah').click()
    
    await expect(page.getByText('Papan markah dikemas kini secara automatik')).toBeVisible()
  })

  test('should display user avatars', async ({ page }) => {
    // Complete a quiz
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    await page.getByText('Papan Markah').click()
    
    // Should show user avatars (first letter of name)
    await expect(page.getByText('T')).toBeVisible() // Test User
  })
})
