import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')

    // Should show login form
    await expect(page.getByRole('heading', { name: /로그인/i })).toBeVisible()
    await expect(page.getByPlaceholder(/이메일/i)).toBeVisible()
    await expect(page.getByPlaceholder(/비밀번호/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /로그인/i })).toBeVisible()
  })

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.goto('/login')

    // Click login without filling form
    await page.getByRole('button', { name: /로그인/i }).click()

    // Should show validation errors
    await expect(page.getByText(/이메일.*필수/i)).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login')

    // Click register link
    await page.getByRole('link', { name: /회원가입/i }).click()

    // Should navigate to register page
    await expect(page).toHaveURL(/register/)
    await expect(page.getByRole('heading', { name: /회원가입/i })).toBeVisible()
  })

  test('should display register page with all fields', async ({ page }) => {
    await page.goto('/register')

    // Should show registration form
    await expect(page.getByRole('heading', { name: /회원가입/i })).toBeVisible()
    await expect(page.getByPlaceholder(/이름/i)).toBeVisible()
    await expect(page.getByPlaceholder(/이메일/i)).toBeVisible()
  })

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/login')

    // Click forgot password link
    await page.getByRole('link', { name: /비밀번호.*찾기/i }).click()

    // Should navigate to forgot password page
    await expect(page).toHaveURL(/forgot-password/)
  })
})
