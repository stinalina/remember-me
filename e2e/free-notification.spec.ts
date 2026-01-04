import { test, expect } from '@playwright/test';
//TODO use test DB for this!
test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/free-notification');
  await page.getByRole('textbox', { name: 'Sende Erinnerung an:' }).click();
  await page.getByRole('textbox', { name: 'Sende Erinnerung an:' }).fill('stinaboehmig@gmx.de');
  await page.getByRole('paragraph').click();
  await page.locator('.ProseMirror').fill('Playwright test');
  await page.getByRole('button', { name: 'Create Notification' }).click();
});