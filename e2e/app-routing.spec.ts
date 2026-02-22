import { test, expect } from '@playwright/test';

test.describe('App.html - Router Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to home when clicking Home button', async ({ page }) => {
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL('/home');
  });

  test('should navigate to free-notification when clicking Ausprobieren button', async ({ page }) => {
    await page.getByRole('button', { name: 'Ausprobieren' }).click();
    await expect(page).toHaveURL('/free-notification');
  });

  test('should navigate to impressum when clicking Impressum link', async ({ page }) => {
    await page.getByRole('link', { name: 'Impressum' }).click();
    await expect(page).toHaveURL('/impressum');
  });

  test('should navigate to agb when clicking AGB link', async ({ page }) => {
    await page.getByRole('link', { name: 'AGB' }).click();
    await expect(page).toHaveURL('/agb');
  });

  test('should navigate to datenschutz when clicking Datenschutz link', async ({ page }) => {
    await page.getByRole('link', { name: 'Datenschutz' }).click();
    await expect(page).toHaveURL('/dsgvo');
  });

  test('should navigate to pricing when clicking Pricing link', async ({ page }) => {
    await page.getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL('/pricing');
  });
});
