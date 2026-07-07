import { expect, Page } from "@playwright/test";

export class Global {
  public static async login(page: Page, mail: string, password: string): Promise<void> {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Dran bleiben' }).click();
    await page.getByTestId('login-reme-mail-input').fill(mail);
    await page.getByTestId('login-reme-password-input').fill(password);
    await page.getByRole('button', { name: 'Einloggen' }).click();
    await expect(page).toHaveURL(/.*home/);
  }
}