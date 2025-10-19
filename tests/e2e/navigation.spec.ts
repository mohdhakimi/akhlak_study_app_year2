import { test, expect } from '@playwright/test'

test.describe('Main Menu Navigation', () => {
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

  test('should display main menu with all navigation cards', async ({
    page,
  }) => {
    // Check if main menu elements are visible
    await expect(
      page.getByRole('heading', { name: 'Akhlak Tahun Dua KSRI' })
    ).toBeVisible()
    await expect(
      page.getByText('Aplikasi Pembelajaran Interaktif')
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Mod Belajar' })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Mod Kuiz' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Mod Ujian' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Papan Markah' })
    ).toBeVisible()
  })

  test('should navigate to Study Mode when clicked', async ({ page }) => {
    await page.getByRole('heading', { name: 'Mod Belajar' }).click()
    await expect(page).toHaveURL('/study')
    await expect(
      page.getByRole('heading', { name: 'Pilih Topik' })
    ).toBeVisible()
  })

  test('should navigate to Quiz Mode when clicked', async ({ page }) => {
    await page.getByRole('heading', { name: 'Mod Kuiz' }).click()
    await expect(page).toHaveURL('/quiz')
    await expect(page.getByText('Pilih Kategori Kuiz')).toBeVisible()
  })

  test('should navigate to Test Mode when clicked', async ({ page }) => {
    await page.getByRole('heading', { name: 'Mod Ujian' }).click()
    await expect(page).toHaveURL('/test')
    await expect(
      page.getByRole('heading', { name: 'Ujian Komprehensif' })
    ).toBeVisible()
  })

  test('should navigate to Leaderboard when clicked', async ({ page }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).click()
    await expect(page).toHaveURL('/leaderboard')
    await expect(
      page.getByText('Lihat prestasi terbaik pelajar dalam kuiz dan ujian')
    ).toBeVisible()
  })

  test('should return to main menu from any page', async ({ page }) => {
    // Navigate to Study Mode
    await page.getByRole('heading', { name: 'Mod Belajar' }).click()
    await expect(page).toHaveURL('/study')

    // Click back to main menu
    await page.getByText('Kembali ke Menu').click()
    await expect(page).toHaveURL('/')
    await expect(
      page.getByRole('heading', { name: 'Akhlak Tahun Dua KSRI' })
    ).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Check if elements are still visible on mobile
    await expect(
      page.getByRole('heading', { name: 'Mod Belajar' })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Mod Kuiz' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Mod Ujian' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Papan Markah' })
    ).toBeVisible()
  })
})
