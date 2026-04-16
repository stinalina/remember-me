import { test, expect } from '@playwright/test';

test.describe('RegisterComponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Dran bleiben' }).click();
    await page.getByText('Werde Mitglied', {exact: true}).click();
  });

  test('should open dsgvo modal on clicking dsgvo', async ({ page }) => {
    // Find the RegisterComponent and click the DSGVO link inside it
    const registerComponent = page.locator('reme-register');
    await registerComponent.getByText('DSGVO', {exact: true}).click();
    
    // Wait for modal to open and check if it's visible
    const modal = page.locator('#dsgvo');
    await expect(modal).toBeVisible();
    
    // Verify modal contains the expected title
    const title = modal.locator('h1');
    await expect(title).toContainText('Datenschutzerklärung');
  });

  test('register button should be disabled when form is empty', async ({ page }) => {
    const registerButton = page.getByRole('button', { name: 'Loslegen!' });
    await expect(registerButton).toBeDisabled();
  });

  test('register button should be disabled when dsgvo check is missing', async ({ page }) => {
    await page.getByTestId('register-mail-reme-mail-input').fill('test@example.com');
    await page.getByTestId('register-pw-reme-password-input').fill('password123');
    await page.getByTestId('register-repeat-pw-reme-password-input').fill('password123');
    await page.getByTestId('register-dsgvo-checkbox').uncheck();
    const registerButton = page.getByRole('button', { name: 'Loslegen!' });
    await expect(registerButton).toBeDisabled();
  });

  test('register button should be enabled when form is filled', async ({ page }) => {
    await page.getByTestId('register-mail-reme-mail-input').fill('test@example.com');
    await page.getByTestId('register-pw-reme-password-input').fill('password123');
    await page.getByTestId('register-repeat-pw-reme-password-input').fill('password123');
    await page.getByTestId('register-dsgvo-checkbox').check();
    const registerButton = page.getByRole('button', { name: 'Loslegen!' });
    await expect(registerButton).toBeEnabled();
  });
});