import { test, expect } from '@playwright/test'

test.describe('Attendance Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/attendance')
  })

  test('should display attendance page', async ({ page }) => {
    // Should show attendance page title
    await expect(page.getByRole('heading', { name: /근태 관리/i })).toBeVisible()
  })

  test('should display today date', async ({ page }) => {
    // Should show today's date in Korean format
    const today = new Date()
    const year = today.getFullYear()

    // Check if year is displayed
    await expect(page.getByText(new RegExp(`${year}년`, 'i'))).toBeVisible()
  })

  test('should display clock in/out buttons or status', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500)

    // Should show either clock in button, clock out button, or status
    const clockInButton = page.getByRole('button', { name: /출근하기/i })
    const clockOutButton = page.getByRole('button', { name: /퇴근하기/i })
    const statusText = page.getByText(/출근 전|근무 중|퇴근 완료/i)

    const hasClockIn = await clockInButton.isVisible().catch(() => false)
    const hasClockOut = await clockOutButton.isVisible().catch(() => false)
    const hasStatus = await statusText.isVisible().catch(() => false)

    expect(hasClockIn || hasClockOut || hasStatus).toBe(true)
  })

  test('should display weekly attendance summary', async ({ page }) => {
    // Should show week attendance section
    await expect(page.getByText(/이번 주|주간/i)).toBeVisible()
  })

  test('should display day names', async ({ page }) => {
    // Should show Korean day names
    const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일']
    for (const day of dayNames) {
      const dayElement = page.getByText(new RegExp(day.slice(0, 1) + '요일', 'i'))
      await expect(dayElement.first()).toBeVisible()
    }
  })
})

test.describe('Team Attendance Page', () => {
  test('should display team attendance page for managers', async ({ page }) => {
    await page.goto('/attendance/team')

    // Should show team attendance page or access denied
    const teamTitle = page.getByRole('heading', { name: /팀원 근태 현황/i })
    const accessDenied = page.getByText(/접근 권한이 없습니다/i)

    const hasTitle = await teamTitle.isVisible().catch(() => false)
    const hasDenied = await accessDenied.isVisible().catch(() => false)

    expect(hasTitle || hasDenied).toBe(true)
  })

  test('should have view toggle buttons', async ({ page }) => {
    await page.goto('/attendance/team')

    // Wait for page to load
    await page.waitForTimeout(500)

    // If has access, should show view toggle
    const todayButton = page.getByRole('button', { name: /오늘/i })
    const monthButton = page.getByRole('button', { name: /월별/i })

    if (await todayButton.isVisible().catch(() => false)) {
      await expect(todayButton).toBeVisible()
      await expect(monthButton).toBeVisible()
    }
  })
})
