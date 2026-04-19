import { test, expect } from '@playwright/test';

test.describe('HomeComponent', () => {
  const testuserEmail = 'testuser@mail.de';
  const testuserPassword = 'test123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Dran bleiben' }).click();
    await page.getByTestId('login-reme-mail-input').fill(testuserEmail);
    await page.getByTestId('login-reme-password-input').fill(testuserPassword);
    await page.getByRole('button', { name: 'Einloggen' }).click();
    await page.waitForURL('**/home');
  });

  test('should display username in header', async ({ page }) => {
    await expect(page.getByTestId('home-username')).toHaveText('testuser');
  });

  test('should display correct notifications count and limit', async ({ page }) => {
    const range = page.getByTestId('home-notifications-range');
    const tooltip = page.getByTestId('home-notifications-tooltip');

    await expect(range).toHaveValue('0');
    await expect(range).toHaveAttribute('max', '5');
    await expect(tooltip).toHaveAttribute('data-tip', '0 von 5 Erinnerungen erstellt diesen Monat.');
  });

  test('logout should navigate to login', async ({ page }) => {
    await page.getByRole('button', { name: 'Abmelden' }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});
