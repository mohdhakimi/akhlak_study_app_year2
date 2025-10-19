import { test, expect } from '@playwright/test'

test.describe('Test Mode', () => {
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
      await page.waitForSelector(
        'input[placeholder="Masukkan nama anda di sini..."]'
      )
      await page
        .getByPlaceholder('Masukkan nama anda di sini...')
        .fill('Test User')
      await page.getByRole('button', { name: /Cipta Pengguna Baru/ }).click()

      // Wait for modal to close
      await page.waitForSelector('[role="dialog"]', { state: 'hidden' })
    }
  })

  test('should navigate to test mode from main menu', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await expect(page).toHaveURL('/test')
    await expect(page.getByText('Ujian Komprehensif')).toBeVisible()
  })

  test('should display test introduction and details', async ({ page }) => {
    await page.getByText('Mod Ujian').click()

    // Check test details
    await expect(page.getByText('30')).toBeVisible() // Number of questions
    await expect(page.getByText('Semua Topik')).toBeVisible() // Categories
    await expect(page.getByText('Tiada Had Masa')).toBeVisible() // Time limit

    // Check instructions
    await expect(page.getByText('Arahan Ujian')).toBeVisible()
    await expect(
      page.getByText('Ujian ini mengandungi 30 soalan pilihan ganda')
    ).toBeVisible()
  })

  test('should start test when start button is clicked', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Should show first question
    await expect(page.getByText('Soalan 1 dari 30')).toBeVisible()
  })

  test('should display answer options with correct letters', async ({
    page,
  }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Check for option letters A, B, C, D
    await expect(page.getByText('A')).toBeVisible()
    await expect(page.getByText('B')).toBeVisible()
    await expect(page.getByText('C')).toBeVisible()
    await expect(page.getByText('D')).toBeVisible()
  })

  test('should show immediate feedback when answer is selected', async ({
    page,
  }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Select an answer
    await page.getByText('Jujur').click()

    // Should show feedback
    await expect(page.getByText('Betul! Jawapan anda tepat.')).toBeVisible()
  })

  test('should navigate through test questions', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Answer first question
    await page.getByText('Jujur').click()
    await page.getByText('Seterusnya →').click()

    // Should show second question
    await expect(page.getByText('Soalan 2 dari 30')).toBeVisible()
  })

  test('should show progress indicator', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Check progress bar
    await expect(page.getByText('3% Selesai')).toBeVisible()

    // Answer first question and go to next
    await page.getByText('Jujur').click()
    await page.getByText('Seterusnya →').click()

    // Check updated progress
    await expect(page.getByText('7% Selesai')).toBeVisible()
  })

  test('should allow navigation between questions', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Answer first question
    await page.getByText('Jujur').click()
    await page.getByText('Seterusnya →').click()

    // Go back to previous question
    await page.getByText('← Sebelum').click()

    // Should be back at first question
    await expect(page.getByText('Soalan 1 dari 30')).toBeVisible()
  })

  test('should complete test and show results', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Answer first few questions (simplified for testing)
    for (let i = 0; i < 3; i++) {
      await page.getByText('Jujur').click()
      if (i < 2) {
        await page.getByText('Seterusnya →').click()
      }
    }

    // Should show results page
    await expect(page.getByText('Keputusan Ujian')).toBeVisible()
    await expect(page.getByText('Ujian Komprehensif - 30 Soalan')).toBeVisible()
  })

  test('should display score and percentage in results', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Complete test quickly
    await page.getByText('Jujur').click()
    await page.getByText('Seterusnya →').click()
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()

    // Check results display
    await expect(page.getByText('Markah')).toBeVisible()
    await expect(page.getByText('Peratusan')).toBeVisible()
    await expect(page.getByText('Gred')).toBeVisible()
  })

  test('should show grade based on score', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Complete test
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()

    // Check for grade display
    await expect(page.getByText(/A\+|A|B\+|B|C\+|C|D/)).toBeVisible()
  })

  test('should show detailed review of all questions', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Complete test
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()

    // Check for detailed review section
    await expect(page.getByText('Semakan Terperinci')).toBeVisible()
  })

  test('should show statistics in results', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Complete test
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()

    // Check for statistics
    await expect(page.getByText('Statistik Ujian')).toBeVisible()
    await expect(page.getByText('Betul')).toBeVisible()
    await expect(page.getByText('Salah')).toBeVisible()
    await expect(page.getByText('Jumlah')).toBeVisible()
  })

  test('should allow retaking test from results', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Complete test
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()

    // Click retake button
    await page.getByText('Ambil Ujian Lagi').click()

    // Should be back at first question
    await expect(page.getByText('Soalan 1 dari 30')).toBeVisible()
  })

  test('should navigate to leaderboard from results', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Complete test
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()

    // Click leaderboard button
    await page.getByText('Lihat Papan Markah').click()

    // Should navigate to leaderboard
    await expect(page).toHaveURL('/leaderboard')
  })

  test('should return to main menu from results', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Complete test
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()

    // Click back to menu button
    await page.getByText('Kembali ke Menu').click()

    // Should be back at main menu
    await expect(page).toHaveURL('/')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter') // Should select first option

    // Should show feedback
    await expect(page.getByText('Betul! Jawapan anda tepat.')).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.getByText('Mod Ujian').click()

    // Check if test introduction is visible on mobile
    await expect(page.getByText('Ujian Komprehensif')).toBeVisible()
    await expect(page.getByText('30')).toBeVisible()

    // Start test
    await page.getByText('Mula Ujian').click()

    // Check if test interface is visible on mobile
    await expect(page.getByText('Soalan 1 dari 30')).toBeVisible()
  })

  test('should show performance messages based on score', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Complete test with correct answers
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()

    // Should show performance message
    await expect(
      page.getByText(/Sempurna|Cemerlang|Bagus|Lulus|Cuba Lagi/)
    ).toBeVisible()
  })

  test('should display time spent in results', async ({ page }) => {
    await page.getByText('Mod Ujian').click()
    await page.getByText('Mula Ujian').click()

    // Wait a bit to simulate time passing
    await page.waitForTimeout(1000)

    // Complete test
    await page.getByText('Jujur').click()
    await page.getByText('Selesai').click()

    // Should show time spent
    await expect(page.getByText('Masa')).toBeVisible()
  })
})
