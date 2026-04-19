import { test, expect } from '@playwright/test';

test.describe('LoginComponent', () => {
  const testuserEmail = 'testuser@mail.de';
  const testuserPassword = 'test123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByTestId('login-reme-mail-input').fill(testuserEmail);
    await page.getByTestId('login-reme-password-input').fill(testuserPassword);
    await page.getByRole('button', { name: 'Einloggen' }).click();
  });

  test('logout should navigate to login', async ({ page }) => {
    await page.getByRole('button', { name: 'Abmelden' }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});
