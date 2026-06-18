import { test, expect } from '@playwright/test';

test.describe('RegisterComponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Dran bleiben' }).click();
    await page.getByText('Werde Mitglied', {exact: true}).click();
  });

  test('should open dsgvo modal on clicking dsgvo', async ({ page }) => {
    const registerComponent = page.locator('reme-register');
    await registerComponent.getByText('DSGVO', {exact: true}).click();
    
    const modal = page.locator('#dsgvo');
    await expect(modal).toBeVisible();
    
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

  test('new registered user should succesfully added to DB and navigated to personal space', async ({ page }) => {
    const username = `test${Date.now()}`;
    const uniqueMail = `${username}@example.com`;
    await page.getByTestId('register-mail-reme-mail-input').fill(uniqueMail);
    await page.getByTestId('register-pw-reme-password-input').fill('password123');
    await page.getByTestId('register-repeat-pw-reme-password-input').fill('password123');
    await page.getByTestId('register-dsgvo-checkbox').check();
    await page.getByRole('button', { name: 'Loslegen!' }).click();
    await expect(page).toHaveURL(/.*home/, { timeout: 10000 });
  });
});