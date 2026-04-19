import { test, expect } from '@playwright/test';

test.describe('LoginComponent', () => {
  const testuserEmail = 'testuser@mail.de';
  const testuserPassword = 'test123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Dran bleiben' }).click();
  });

  test('login button should be disabled when email and password are empty', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'Einloggen' });
    await expect(loginButton).toBeDisabled();
  });

  test('login button should be enabled when email and password are filled', async ({ page }) => {
    await page.getByTestId('login-reme-mail-input').fill(testuserEmail);
    await page.getByTestId('login-reme-password-input').fill(testuserPassword);
    const loginButton = page.getByRole('button', { name: 'Einloggen' });
    await expect(loginButton).toBeEnabled();
  });

  test('successfull login should navigate to personal home', async ({ page }) => {
    await page.getByTestId('login-reme-mail-input').fill(testuserEmail);
    await page.getByTestId('login-reme-password-input').fill(testuserPassword);
    await page.getByRole('button', { name: 'Einloggen' }).click();
    await expect(page).toHaveURL(/.*home/);
  });
});
