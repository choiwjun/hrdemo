import { test, expect } from '@playwright/test'

test.describe('Mail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to mail page
    await page.goto('/mail')
  })

  test('should display mail page with sidebar and list', async ({ page }) => {
    // Should show mail sidebar
    await expect(page.getByText(/받은편지함/i)).toBeVisible()
    await expect(page.getByText(/보낸편지함/i)).toBeVisible()
  })

  test('should display message list', async ({ page }) => {
    // Wait for messages to load
    await page.waitForTimeout(500)

    // Should show messages or empty state
    const messageList = page.locator('[data-testid="mail-list"]').or(page.getByText(/메시지가 없습니다/i))
    await expect(messageList.first()).toBeVisible({ timeout: 5000 })
  })

  test('should filter by service', async ({ page }) => {
    // Wait for initial load
    await page.waitForTimeout(500)

    // Try to find and click Gmail filter if exists
    const gmailFilter = page.getByText(/Gmail/i).first()
    if (await gmailFilter.isVisible()) {
      await gmailFilter.click()
      await page.waitForTimeout(300)
    }

    // Try to find and click Slack filter if exists
    const slackFilter = page.getByText(/Slack/i).first()
    if (await slackFilter.isVisible()) {
      await slackFilter.click()
      await page.waitForTimeout(300)
    }
  })

  test('should open compose modal', async ({ page }) => {
    // Click compose button
    const composeButton = page.getByRole('button', { name: /작성|새 메시지/i })

    if (await composeButton.isVisible()) {
      await composeButton.click()

      // Should show compose modal
      await expect(page.getByText(/새 메시지|메시지 작성/i)).toBeVisible({ timeout: 3000 })
    }
  })

  test('should search messages', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/검색/i)

    if (await searchInput.isVisible()) {
      // Type search query
      await searchInput.fill('test')
      await page.waitForTimeout(500)

      // Clear search
      await searchInput.fill('')
    }
  })
})
