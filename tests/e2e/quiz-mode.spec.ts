import { test, expect } from '@playwright/test'

test.describe('Quiz Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load and check if user selection modal appears
    await page.waitForLoadState('networkidle')
    
    // Check if user selection modal is visible
    const userModal = page.locator('[role="dialog"]')
    const isModalVisible = await userModal.isVisible().catch(() => false)
    
    if (isModalVisible) {
      // Click "Create New User" button first
      await page.getByRole('button', { name: /Cipta Pengguna Baru/ }).click()
      
      // Wait for the form to appear and fill it
      await page.waitForSelector('input[placeholder="Masukkan nama anda di sini..."]')
      await page.getByPlaceholder('Masukkan nama anda di sini...').fill('Test User')
      await page.getByRole('button', { name: /Cipta Pengguna Baru/ }).click()
      
      // Wait for modal to close
      await page.waitForSelector('[role="dialog"]', { state: 'hidden' })
    }
  })

  test('should navigate to quiz mode from main menu', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await expect(page).toHaveURL('/quiz')
    await expect(page.getByText('Pilih Kategori Kuiz')).toBeVisible()
  })

  test('should display quiz categories', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    
    // Check if categories are displayed
    await expect(page.getByText('Akhlak Terpuji')).toBeVisible()
    await expect(page.getByText('Akhlak Terhadap Ibu Bapa')).toBeVisible()
    
    // Check category descriptions
    await expect(page.getByText('Mengenali dan mempraktikkan akhlak yang terpuji')).toBeVisible()
    await expect(page.getByText('Cara menghormati dan berbuat baik kepada ibu bapa')).toBeVisible()
  })

  test('should start quiz when category is selected', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Should show first question
    await expect(page.getByText('Soalan 1 dari 10')).toBeVisible()
    await expect(page.getByText('Apakah akhlak terpuji yang pertama?')).toBeVisible()
  })

  test('should display answer options with correct letters', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Check for option letters A, B, C, D
    await expect(page.getByText('A')).toBeVisible()
    await expect(page.getByText('B')).toBeVisible()
    await expect(page.getByText('C')).toBeVisible()
    await expect(page.getByText('D')).toBeVisible()
  })

  test('should show immediate feedback when answer is selected', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Select an answer
    await page.getByText('Jujur').click()
    
    // Should show feedback
    await expect(page.getByText('Betul! Jawapan anda tepat.')).toBeVisible()
  })

  test('should navigate through quiz questions', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Answer first question
    await page.getByText('Jujur').click()
    await page.getByText('Seterusnya →').click()
    
    // Should show second question
    await expect(page.getByText('Soalan 2 dari 10')).toBeVisible()
  })

  test('should show progress indicator', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Check progress bar
    await expect(page.getByText('10% Selesai')).toBeVisible()
    
    // Answer first question and go to next
    await page.getByText('Jujur').click()
    await page.getByText('Seterusnya →').click()
    
    // Check updated progress
    await expect(page.getByText('20% Selesai')).toBeVisible()
  })

  test('should allow navigation between questions', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Answer first question
    await page.getByText('Jujur').click()
    await page.getByText('Seterusnya →').click()
    
    // Go back to previous question
    await page.getByText('← Sebelum').click()
    
    // Should be back at first question
    await expect(page.getByText('Soalan 1 dari 10')).toBeVisible()
  })

  test('should complete full quiz and show results', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Answer all questions (simplified - just answer first few)
    for (let i = 0; i < 3; i++) {
      await page.getByText('Jujur').click()
      if (i < 2) {
        await page.getByText('Seterusnya →').click()
      }
    }
    
    // Should show results page
    await expect(page.getByText('Keputusan Kuiz')).toBeVisible()
    await expect(page.getByText('Akhlak Terpuji')).toBeVisible()
  })

  test('should display score and percentage in results', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Complete quiz quickly
    await page.getByText('Jujur').click()
    await page.getByText('Seterusnya →').click()
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    // Check results display
    await expect(page.getByText('Markah')).toBeVisible()
    await expect(page.getByText('Peratusan')).toBeVisible()
  })

  test('should show detailed review of all questions', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Complete quiz
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    // Check for detailed review section
    await expect(page.getByText('Semakan Terperinci')).toBeVisible()
  })

  test('should allow retaking quiz from results', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Complete quiz
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    // Click retake button
    await page.getByText('Ambil Kuiz Lagi').click()
    
    // Should be back at first question
    await expect(page.getByText('Soalan 1 dari 10')).toBeVisible()
  })

  test('should navigate to leaderboard from results', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Complete quiz
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    // Click leaderboard button
    await page.getByText('Lihat Papan Markah').click()
    
    // Should navigate to leaderboard
    await expect(page).toHaveURL('/leaderboard')
  })

  test('should return to main menu from results', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Complete quiz
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    // Click back to menu button
    await page.getByText('Kembali ke Menu').click()
    
    // Should be back at main menu
    await expect(page).toHaveURL('/')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter') // Should select first option
    
    // Should show feedback
    await expect(page.getByText('Betul! Jawapan anda tepat.')).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.getByText('Mod Kuiz').click()
    
    // Check if category selection is visible on mobile
    await expect(page.getByText('Pilih Kategori Kuiz')).toBeVisible()
    await expect(page.getByText('Akhlak Terpuji')).toBeVisible()
    
    // Select category
    await page.getByText('Akhlak Terpuji').click()
    
    // Check if quiz interface is visible on mobile
    await expect(page.getByText('Soalan 1 dari 10')).toBeVisible()
  })

  test('should show performance messages based on score', async ({ page }) => {
    await page.getByText('Mod Kuiz').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Complete quiz with correct answers
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()
    
    // Should show performance message
    await expect(page.getByText(/Sempurna|Cemerlang|Bagus|Cuba Lagi/)).toBeVisible()
  })
})
