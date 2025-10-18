import { test, expect } from '@playwright/test'

test.describe('Study Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to study mode from main menu', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    await expect(page).toHaveURL('/study')
    await expect(page.getByText('Pilih Topik')).toBeVisible()
  })

  test('should display topic selection with available topics', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    
    // Check if topics are displayed
    await expect(page.getByText('Akhlak Terpuji')).toBeVisible()
    await expect(page.getByText('Akhlak Terhadap Ibu Bapa')).toBeVisible()
    
    // Check topic descriptions
    await expect(page.getByText('Mengenali dan mempraktikkan akhlak yang terpuji dalam kehidupan seharian')).toBeVisible()
    await expect(page.getByText('Cara menghormati dan berbuat baik kepada ibu bapa')).toBeVisible()
  })

  test('should start studying when topic is selected', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Should show study card
    await expect(page.getByText('Pengenalan Akhlak Terpuji')).toBeVisible()
    await expect(page.getByText('Kemajuan')).toBeVisible()
    await expect(page.getByText('1 dari 3')).toBeVisible()
  })

  test('should navigate through study notes', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Check first note
    await expect(page.getByText('Pengenalan Akhlak Terpuji')).toBeVisible()
    await expect(page.getByText('1 dari 3')).toBeVisible()
    
    // Navigate to next note
    await page.getByText('Seterusnya').click()
    await expect(page.getByText('Contoh Akhlak Terpuji')).toBeVisible()
    await expect(page.getByText('2 dari 3')).toBeVisible()
    
    // Navigate to previous note
    await page.getByText('Sebelum').click()
    await expect(page.getByText('Pengenalan Akhlak Terpuji')).toBeVisible()
    await expect(page.getByText('1 dari 3')).toBeVisible()
  })

  test('should show completion message on last note', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Navigate to last note
    await page.getByText('Seterusnya').click()
    await page.getByText('Seterusnya').click()
    
    // Should show completion message
    await expect(page.getByText('Topik Selesai')).toBeVisible()
    await expect(page.getByText('Syabas! Anda telah selesai mempelajari topik ini.')).toBeVisible()
  })

  test('should format content with lists and bullet points', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Navigate to second note which has lists
    await page.getByText('Seterusnya').click()
    
    // Check for numbered list
    await expect(page.getByText('1')).toBeVisible()
    await expect(page.getByText('2')).toBeVisible()
    await expect(page.getByText('Jujur dalam perkataan dan perbuatan')).toBeVisible()
    
    // Navigate to third note which has bullet points
    await page.getByText('Seterusnya').click()
    
    // Check for bullet points
    await expect(page.getByText('Membuatkan kita disukai oleh Allah SWT')).toBeVisible()
  })

  test('should return to topic selection from study card', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Go back to topic selection
    await page.getByText('Kembali ke Menu').click()
    
    // Should be back at topic selection
    await expect(page.getByText('Pilih Topik')).toBeVisible()
    await expect(page.getByText('Akhlak Terpuji')).toBeVisible()
  })

  test('should return to main menu from topic selection', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    await page.getByText('Kembali ke Menu').click()
    
    // Should be back at main menu
    await expect(page).toHaveURL('/')
    await expect(page.getByText('Mod Belajar')).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.getByText('Mod Belajar').click()
    
    // Check if topic selection is visible on mobile
    await expect(page.getByText('Pilih Topik')).toBeVisible()
    await expect(page.getByText('Akhlak Terpuji')).toBeVisible()
    
    // Select a topic
    await page.getByText('Akhlak Terpuji').click()
    
    // Check if study card is visible on mobile
    await expect(page.getByText('Pengenalan Akhlak Terpuji')).toBeVisible()
  })

  test('should handle keyboard navigation', async ({ page }) => {
    await page.getByText('Mod Belajar').click()
    await page.getByText('Akhlak Terpuji').click()
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter') // Should trigger next button
    
    // Should navigate to next note
    await expect(page.getByText('Contoh Akhlak Terpuji')).toBeVisible()
  })
})
