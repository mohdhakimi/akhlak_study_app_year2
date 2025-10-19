import { test, expect } from '@playwright/test'

test.describe('Leaderboard', () => {
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

  test('should navigate to leaderboard from main menu', async ({ page }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()
    await expect(page).toHaveURL('/leaderboard')
    await expect(
      page.getByText('Lihat prestasi terbaik pelajar dalam kuiz dan ujian')
    ).toBeVisible()
  })

  test('should display leaderboard page correctly', async ({ page }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Check main elements
    await expect(
      page.getByText('Lihat prestasi terbaik pelajar dalam kuiz dan ujian')
    ).toBeVisible()
    await expect(page.getByText('Jumlah Percubaan')).toBeVisible()
    await expect(page.getByText('Kuiz', { exact: true })).toBeVisible()
    await expect(page.getByText('Ujian', { exact: true })).toBeVisible()
  })

  test('should show statistics cards', async ({ page }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Check statistics are displayed
    await expect(page.getByText('Jumlah Percubaan')).toBeVisible()
    await expect(page.getByText('Kuiz', { exact: true })).toBeVisible()
    await expect(page.getByText('Ujian', { exact: true })).toBeVisible()
  })

  test('should display filter buttons', async ({ page }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Check filter buttons
    await expect(page.getByRole('button', { name: /Semua/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Kuiz/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Ujian/ })).toBeVisible()
  })

  test('should show empty state when no scores', async ({ page }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Should show empty state
    await expect(page.getByText('Tiada Markah Lagi')).toBeVisible()
    await expect(
      page.getByText(
        'Cuba ambil kuiz atau ujian untuk melihat markah anda di sini!'
      )
    ).toBeVisible()
  })

  test('should filter scores by quiz type', async ({ page }) => {
    // First complete a quiz to have some data
    await page.getByRole('heading', { name: 'Mod Kuiz' }).click()
    await page.getByText('Akhlak Terpuji').click()

    // Complete quiz quickly - answer first question correctly
    await page.getByText('Tingkah laku yang baik dan mulia').click()
    await page.getByText('Seterusnya').click()

    // Answer second question correctly
    await page.getByText('Jujur dalam perkataan').click()
    await page.getByText('Seterusnya').click()

    // Answer third question correctly
    await page.getByText('Supaya Allah SWT suka kepada kita').click()
    await page.getByText('Seterusnya').click()

    // Answer fourth question correctly
    await page.getByText('Membantu rakan yang memerlukan').click()
    await page.getByText('Seterusnya').click()

    // Answer fifth question correctly
    await page.getByText('Kita disukai oleh Allah SWT dan orang lain').click()
    await page.getByText('Selesai').click()

    // Go to leaderboard
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Filter by quiz
    await page.getByText('Kuiz').click()

    await expect(page.getByText('Papan Markah - Kuiz')).toBeVisible()
  })

  test('should filter scores by test type', async ({ page }) => {
    // First complete a test to have some data
    await page.getByRole('heading', { name: 'Mod Ujian' }).click()
    await page.getByText('Mula Ujian').click()

    // Complete test quickly - answer first few questions correctly
    await page.getByText('Tingkah laku yang baik dan mulia').click()
    await page.getByText('Seterusnya').click()

    await page.getByText('Jujur dalam perkataan').click()
    await page.getByText('Seterusnya').click()

    await page.getByText('Supaya Allah SWT suka kepada kita').click()
    await page.getByText('Seterusnya').click()

    // Skip remaining questions to complete test quickly
    for (let i = 0; i < 27; i++) {
      await page.getByText('Seterusnya').click()
    }

    await page.getByText('Selesai').click()

    // Go to leaderboard
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Filter by test
    await page.getByText('Ujian').click()

    await expect(page.getByText('Papan Markah - Ujian')).toBeVisible()
  })

  test('should show all scores when all filter is selected', async ({
    page,
  }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Click different filters and then all
    await page.getByRole('button', { name: /Kuiz/ }).click()
    await page.getByRole('button', { name: /Semua/ }).click()

    await expect(page.getByText('Papan Markah - Semua')).toBeVisible()
  })

  test('should display leaderboard table with correct headers', async ({
    page,
  }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

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
    await page.getByRole('heading', { name: 'Mod Kuiz' }).click()
    await page.getByText('Akhlak Terpuji').click()
    // Complete quiz quickly - answer first question correctly
    await page.getByText('Tingkah laku yang baik dan mulia').click()
    await page.getByText('Seterusnya').click()

    // Answer remaining questions quickly
    for (let i = 0; i < 4; i++) {
      await page.getByText('Seterusnya').click()
    }

    await page.getByText('Selesai').click()

    // Go to leaderboard
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Should highlight current user
    await expect(page.getByText('Anda')).toBeVisible()
  })

  test('should show rank icons for top positions', async ({ page }) => {
    // Complete multiple quizzes/tests to have data
    await page.getByRole('heading', { name: 'Mod Kuiz' }).click()
    await page.getByText('Akhlak Terpuji').click()
    // Complete quiz quickly - answer first question correctly
    await page.getByText('Tingkah laku yang baik dan mulia').click()
    await page.getByText('Seterusnya').click()

    // Answer remaining questions quickly
    for (let i = 0; i < 4; i++) {
      await page.getByText('Seterusnya').click()
    }

    await page.getByText('Selesai').click()

    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Should show rank icons
    await expect(page.getByText('🥇')).toBeVisible()
  })

  test('should display correct type labels', async ({ page }) => {
    // Complete a quiz
    await page.getByRole('heading', { name: 'Mod Kuiz' }).click()
    await page.getByText('Akhlak Terpuji').click()
    // Complete quiz quickly - answer first question correctly
    await page.getByText('Tingkah laku yang baik dan mulia').click()
    await page.getByText('Seterusnya').click()

    // Answer remaining questions quickly
    for (let i = 0; i < 4; i++) {
      await page.getByText('Seterusnya').click()
    }

    await page.getByText('Selesai').click()

    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Should show type labels
    await expect(page.getByText('Kuiz')).toBeVisible()
  })

  test('should show progress bars for percentages', async ({ page }) => {
    // Complete a quiz
    await page.getByRole('heading', { name: 'Mod Kuiz' }).click()
    await page.getByText('Akhlak Terpuji').click()
    // Complete quiz quickly - answer first question correctly
    await page.getByText('Tingkah laku yang baik dan mulia').click()
    await page.getByText('Seterusnya').click()

    // Answer remaining questions quickly
    for (let i = 0; i < 4; i++) {
      await page.getByText('Seterusnya').click()
    }

    await page.getByText('Selesai').click()

    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Should show percentage progress bars
    await expect(page.getByText('%')).toBeVisible()
  })

  test('should format dates correctly', async ({ page }) => {
    // Complete a quiz
    await page.getByRole('heading', { name: 'Mod Kuiz' }).click()
    await page.getByText('Akhlak Terpuji').click()
    // Complete quiz quickly - answer first question correctly
    await page.getByText('Tingkah laku yang baik dan mulia').click()
    await page.getByText('Seterusnya').click()

    // Answer remaining questions quickly
    for (let i = 0; i < 4; i++) {
      await page.getByText('Seterusnya').click()
    }

    await page.getByText('Selesai').click()

    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Should show formatted dates
    await expect(page.getByText('Hari ini')).toBeVisible()
  })

  test('should show encouragement message', async ({ page }) => {
    // Complete a quiz
    await page.getByRole('heading', { name: 'Mod Kuiz' }).click()
    await page.getByText('Akhlak Terpuji').click()
    // Complete quiz quickly - answer first question correctly
    await page.getByText('Tingkah laku yang baik dan mulia').click()
    await page.getByText('Seterusnya').click()

    // Answer remaining questions quickly
    for (let i = 0; i < 4; i++) {
      await page.getByText('Seterusnya').click()
    }

    await page.getByText('Selesai').click()

    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Should show encouragement message
    await expect(page.getByText('Teruskan Berusaha!')).toBeVisible()
    await expect(
      page.getByText('Setiap percubaan adalah langkah ke arah kecemerlangan.')
    ).toBeVisible()
  })

  test('should navigate back to menu', async ({ page }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    await page.getByText('Kembali ke Menu').click()

    // Should be back at main menu
    await expect(page).toHaveURL('/')
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Check if leaderboard is visible on mobile
    await expect(
      page.getByRole('heading', { name: 'Papan Markah' }).first()
    ).toBeVisible()
    await expect(page.getByText('Jumlah Percubaan')).toBeVisible()
  })

  test('should update filter button states', async ({ page }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Click different filters
    await page.getByRole('button', { name: /Kuiz/ }).click()
    await page.getByRole('button', { name: /Ujian/ }).click()
    await page.getByRole('button', { name: /Semua/ }).click()

    // All buttons should be clickable
    await expect(page.getByText('Semua')).toBeVisible()
    await expect(page.getByText('Kuiz', { exact: true })).toBeVisible()
    await expect(page.getByText('Ujian', { exact: true })).toBeVisible()
  })

  test('should show footer message', async ({ page }) => {
    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    await expect(
      page.getByText('Papan markah dikemas kini secara automatik')
    ).toBeVisible()
  })

  test('should display user avatars', async ({ page }) => {
    // Complete a quiz
    await page.getByRole('heading', { name: 'Mod Kuiz' }).click()
    await page.getByText('Akhlak Terpuji').click()
    // Complete quiz quickly - answer first question correctly
    await page.getByText('Tingkah laku yang baik dan mulia').click()
    await page.getByText('Seterusnya').click()

    // Answer remaining questions quickly
    for (let i = 0; i < 4; i++) {
      await page.getByText('Seterusnya').click()
    }

    await page.getByText('Selesai').click()

    await page.getByRole('heading', { name: 'Papan Markah' }).first().click()

    // Should show user avatars (first letter of name)
    await expect(page.getByText('T')).toBeVisible() // Test User
  })
})
